import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.gu.pandomainauth.PublicSettings
import config.Config
import controllers.{AssetsComponents, HomeController, ManagementController, ProxyController}
import filter.RequestLoggingFilter
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import router.Routes

class AppComponents(context: Context, config: Config)
  extends BuiltInComponentsFromContext(context)
    with play.filters.HttpFiltersComponents
    with AssetsComponents
    with AhcWSComponents{

  private val disabledFilters: Set[EssentialFilter] = Set(allowedHostsFilter)
  override def httpFilters: Seq[EssentialFilter] = super.httpFilters.filterNot(disabledFilters.contains) ++ Seq(new RequestLoggingFilter(materializer))

  private val s3Client = AmazonS3ClientBuilder.standard()
    .withCredentials(config.awsCredentials)
    .withRegion(config.awsRegion)
    .build()

  val publicSettings = new PublicSettings(config.panDomainConfig.settingsFileKey, config.panDomainConfig.settingsBucket, s3Client)
  publicSettings.start()

  lazy val homeController = new HomeController(controllerComponents, publicSettings, config)
  lazy val proxyController = new ProxyController(wsClient, controllerComponents, publicSettings, config)
  lazy val managementController = new ManagementController(controllerComponents)

  lazy val router: Router = new Routes(
    httpErrorHandler,
    homeController,
    managementController,
    assets,
    proxyController,
  )
}
