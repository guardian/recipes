import controllers.{AssetsComponents, HomeController}
import filter.RequestLoggingFilter
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import router.Routes

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
    with play.filters.HttpFiltersComponents
    with AssetsComponents {

  override def httpFilters: Seq[EssentialFilter] = super.httpFilters ++ Seq(new RequestLoggingFilter(materializer))

  lazy val homeController = new HomeController(controllerComponents)

  lazy val router: Router = new Routes(
    httpErrorHandler,
    homeController,
    assets
  )
}
