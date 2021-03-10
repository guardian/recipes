package controllers

import auth.PanDomainAuthentication
import com.gu.pandomainauth.PublicSettings
import config.Config
import play.api.Logging
import play.api.http.HttpVerbs
import play.api.libs.ws.WSClient
import play.api.libs.json.Json
import play.api.mvc.{BaseController, ControllerComponents}
import proxy.{ProxyResponse, ProxyResult}

import scala.concurrent.duration.DurationInt
import scala.concurrent.{ExecutionContext, Future}

class ProxyController(
  wsClient: WSClient,
  override val controllerComponents: ControllerComponents,
  val publicSettings: PublicSettings,
  val config: Config
)(implicit ec: ExecutionContext) extends BaseController with PanDomainAuthentication with Logging {
  private val TIMEOUT = 10000.millis

  def get(path: String) = ApiAuthAction.async {
    val destination = s"${config.domainConfig.proxyingDomain}/$path"

    ProxyResult {
      wsClient.url(destination)
        .withMethod(HttpVerbs.GET)
        .withHttpHeaders(USER_AGENT -> s"gu-recipes-${config.stage}")
        .withRequestTimeout(TIMEOUT)
        .stream()
        .map(new ProxyResponse(_))
        .flatMap(handleResponse)
    }
  }

  def redirectRelative(path: String) = ApiAuthAction { request =>
    import config.domainConfig._
    request.headers.get(REFERER) match {
      case Some(referer) if referer.startsWith(s"$self/proxy/") => Redirect(routes.ProxyController.get(path))
      case _ => NotFound(s"Resource not found $path")
    }
  }

  private def handleResponse: PartialFunction[ProxyResponse, Future[ProxyResult]] = {
    case response => Future.successful(ProxyResult(response))
  }

  def getCAPI(id: String) = Action.async { implicit request =>
    val destination = "https://content.guardianapis.com/%s?show-fields=body&show-elements=image&api-key=%s".format(id, config.capiApiKey)
    logger.info(destination)
    wsClient.url(destination)
      .withMethod(HttpVerbs.GET)
      .withHttpHeaders(USER_AGENT -> s"gu-recipes-${config.stage}")
      .withRequestTimeout(TIMEOUT)
      .stream()
      .map {
        resp => {
          val responses = Json.parse(resp.body)
          val isok = (responses \ "response" \ "status").as[String]
          if (isok == "ok") {
            val numResults = (responses \ "response" \ "total").as[Int]

            if (numResults < 1) {
              NotFound("No CAPI responses for: %s.".format(id))
            } else {
              Ok((responses \ "response" \ "content").get )
            }
          } else {
            val msg = (responses \ "response" \ "message").get
            InternalServerError("CAPI returned error: %s".format(msg))
          }
        }
      }
  }
}
