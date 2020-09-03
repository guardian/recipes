package logging

import java.net.InetSocketAddress

import ch.qos.logback.classic.spi.ILoggingEvent
import config.Config
import model.Stage
import play.api.ApplicationLoader.Context
import play.api.LoggerConfigurator
import ch.qos.logback.classic.{Logger => LogbackLogger}
import com.gu.logback.appender.kinesis.KinesisAppender
import org.slf4j.{LoggerFactory, Logger => SLFLogger}
import net.logstash.logback.appender.LogstashTcpSocketAppender
import net.logstash.logback.encoder.LogstashEncoder
import net.logstash.logback.layout.LogstashLayout
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
      "app" -> config.app,
      "region" -> config.awsRegion.getName,
      "buildNumber" -> recipes.BuildInfo.buildNumber
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

  def initRemoteLogShipping(config: Config): Unit = {
    if(config.stage == Stage.Dev) rootLogger.info("Remote log shipping via Kinesis disabled in DEV") else {
      if(config.loggingStreamName.isEmpty) rootLogger.info("Missing remote logging configuration") else {
        config.loggingStreamName.foreach { streamName =>
          Try {
            rootLogger.info(s"Initialising remote log shipping via Kinesis on $streamName")
            val customFields = makeCustomFields(config)
            val context = rootLogger.getLoggerContext

            val layout = new LogstashLayout()
            layout.setContext(context)
            layout.setCustomFields(customFields)
            layout.start()

            val appender = new KinesisAppender[ILoggingEvent]()
            appender.setBufferSize(BUFFER_SIZE)
            appender.setRegion(config.awsRegion.getName)
            appender.setStreamName(streamName)
            appender.setContext(context)
            appender.setLayout(layout)
            appender.setCredentialsProvider(config.awsCredentials)
            appender.start()

            rootLogger.addAppender(appender)
            rootLogger.info("Initialised remote log shipping")
          } recover {
            case e => rootLogger.error("Failed to initialise remote log shipping", e)
          }
        }
      }
    }
  }
}
