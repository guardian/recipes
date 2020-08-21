import controllers.{AssetsComponents, HomeController}
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.routing.Router
import router.Routes

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
    with play.filters.HttpFiltersComponents
    with AssetsComponents {

  lazy val homeController = new HomeController(controllerComponents)

  lazy val router: Router = new Routes(
    httpErrorHandler,
    homeController,
    assets
  )
}
