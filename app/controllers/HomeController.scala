package controllers

import auth.PanDomainAuthentication
import com.gu.pandomainauth.PublicSettings
import config.Config
import play.api.Logging
import play.api.mvc._
import model.Stage.Prod

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

class HomeController (
  override val controllerComponents: ControllerComponents,
  val publicSettings: PublicSettings,
  val config: Config
) extends BaseController with Logging with PanDomainAuthentication {
  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index(id: String) = ApiAuthAction {
    logger.info(s"Hello there, using api key: ${config.capiApiKey.slice(0,5)}...")

    val pinboardDomain = if (config.stage == Prod) {
      "gutools.co.uk"
    } else {
      "code.dev-gutools.co.uk" // This assumes we're not developing Pinboard in parrallel
    }

    Ok(views.html.index(pinboardDomain))
  }
}
