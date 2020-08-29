package auth

import java.net.URI

import com.gu.pandomainauth.model.{Authenticated, AuthenticatedUser, AuthenticationStatus, User}
import com.gu.pandomainauth.{PanDomain, PublicKey, PublicSettings}
import config.Config
import play.api.Logging
import play.api.mvc._

import scala.concurrent.duration.DurationInt
import scala.concurrent.{ExecutionContext, Future}

class UserRequest[A](val user: User, request: Request[A]) extends WrappedRequest[A](request)

trait PanDomainAuthentication extends BaseControllerHelpers with Logging {
  def publicSettings: PublicSettings
  val config: Config

  private def getLoginRedirectUri(path: String): URI = {
    import config.domainConfig._
    new URI(s"$loginService/login?returnUrl=$self$path")
  }

  def unauthorisedResponse[A](request: Request[A]) = {
    Future.successful(Unauthorized(views.html.login(getLoginRedirectUri(request.path))))
  }

  def authStatus(cookie: Cookie, publicKey: PublicKey): AuthenticationStatus = {
    PanDomain.authStatus(
      cookie.value,
      publicKey,
      PanDomain.guardianValidation,
      apiGracePeriod = 1.hours.toMillis,
      system = config.app,
      cacheValidation = false
    )
  }

  object ApiAuthAction extends ActionBuilder[UserRequest, AnyContent] {
    override def parser: BodyParser[AnyContent] = PanDomainAuthentication.this.controllerComponents.parsers.default
    override protected def executionContext: ExecutionContext = PanDomainAuthentication.this.controllerComponents.executionContext

    override def invokeBlock[A](request: Request[A], block: UserRequest[A] => Future[Result]): Future[Result] = {
      publicSettings.publicKey match {
        case Some(pk) =>
          request.cookies.get("gutoolsAuth-assym") match {
            case Some(cookie) =>
              authStatus(cookie, pk) match {
                case Authenticated(AuthenticatedUser(user, _, _, _, _)) =>
                  block(new UserRequest(user, request))

                case other =>
                  logger.info(s"Login response $other")
                  unauthorisedResponse(request)
              }

            case None =>
              logger.warn("Panda cookie missing")
              unauthorisedResponse(request)
          }

        case None =>
          logger.error("Panda public key unavailable")
          unauthorisedResponse(request)
      }
    }
  }
}
