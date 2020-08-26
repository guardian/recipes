package controllers

import play.api.Logging
import play.api.mvc._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */

class HomeController (override val controllerComponents: ControllerComponents) extends BaseController with Logging {
  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index(id: String) = Action {
    logger.info("hello there")
    Ok(views.html.index())
  }
}
