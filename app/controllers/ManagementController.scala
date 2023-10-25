package controllers

import play.api.Logging
import play.api.libs.json.Json
import play.api.mvc.{BaseController, ControllerComponents}

class ManagementController (override val controllerComponents: ControllerComponents) extends BaseController with Logging {

  def disallowRobots = Action {
    Ok("User-agent: *\nDisallow: /\n")
  }

  def healthCheck = Action {
    Ok("OK")
  }
}
