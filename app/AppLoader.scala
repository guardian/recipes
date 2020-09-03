import config.Config
import logging.LogConfig
import play.api.ApplicationLoader.Context
import play.api._

class AppLoader extends ApplicationLoader {
  override def load(context: Context): Application = {
    val config = new Config(context.initialConfiguration)

    LogConfig.initPlayLogging(context)
    LogConfig.initLocalLogShipping(config)
    LogConfig.initRemoteLogShipping(config)

    new AppComponents(context, config).application
  }
}
