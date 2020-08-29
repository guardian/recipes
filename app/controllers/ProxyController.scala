package controllers

import auth.PanDomainAuthentication
import com.gu.pandomainauth.PublicSettings
import config.Config
import play.api.Logging
import play.api.http.HttpVerbs
import play.api.libs.ws.WSClient
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
}
