package logging

import java.net.InetSocketAddress

import config.Config
import model.Stage
import play.api.ApplicationLoader.Context
import play.api.LoggerConfigurator
import ch.qos.logback.classic.{Logger => LogbackLogger}
import org.slf4j.{LoggerFactory, Logger => SLFLogger}
import net.logstash.logback.appender.LogstashTcpSocketAppender
import net.logstash.logback.encoder.LogstashEncoder
import play.api.libs.json.Json

import scala.util.Try

object LogConfig {
  private val BUFFER_SIZE = 1000
  private val rootLogger: LogbackLogger = LoggerFactory.getLogger(SLFLogger.ROOT_LOGGER_NAME).asInstanceOf[LogbackLogger]

  def initPlayLogging(context: Context): Unit = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }
  }

  private def makeCustomFields(config: Config): String = {
    Json.toJson(Map(
      "stack" -> config.stack,
      "stage" -> config.stage.toString.toUpperCase,
      "app" -> config.app
    )).toString()
  }

  def initLocalLogShipping(config: Config): Unit = {
    if (config.stage != Stage.Dev) rootLogger.info("Local log shipping only available in DEV") else {
      if (!config.localLogShipping) rootLogger.info("Local log shipping is disabled") else {
        Try {
          rootLogger.info("Initialising local log shipping")

          val customFields = makeCustomFields(config)

          val appender = new LogstashTcpSocketAppender()
          appender.setContext(rootLogger.getLoggerContext)

          // hard code the destination as we're relying on the use of local-elk which only accepts TCP traffic on localhost:5000
          // see https://github.com/guardian/local-elk
          appender.addDestinations(new InetSocketAddress("localhost", 5000))
          appender.setWriteBufferSize(BUFFER_SIZE)

          val encoder = new LogstashEncoder()
          encoder.setCustomFields(customFields)
          appender.setEncoder(encoder)

          encoder.start()
          appender.start()

          rootLogger.addAppender(appender)

          rootLogger.info("Initialised local log shipping")
        } recover {
          case e => rootLogger.error("Failed to initialise local log shipping", e)
        }
      }
    }
  }
}
