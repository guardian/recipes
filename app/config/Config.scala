package config

import java.io.File

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, DefaultAWSCredentialsProviderChain}
import com.amazonaws.regions.Regions
import model.Stage
import model.Stage.Dev
import play.api.{Configuration, Logging}

import scala.io.Source.fromFile

class Config(playConfig: Configuration) extends Logging {
  lazy val stack: String = playConfig.get[String]("stack")
  lazy val app: String = playConfig.get[String]("app")

  final lazy val stage: Stage = {
    val stageFilePath: String = "/etc/gu/stage"
    val file = new File(stageFilePath)

    if (file.exists) {
      val stageFileValue = fromFile(file).mkString.trim
      logger.info(s"contents of $stageFilePath is $stageFileValue")
      Stage.withNameOrDev(stageFileValue)
    } else {
      logger.info(s"$stageFilePath not found, stage will be ${Stage.Dev}")
      Stage.Dev
    }
  }

  val panDomainConfig: PanDomainConfig = PanDomainConfig(stage)

  lazy val awsCredentials: AWSCredentialsProvider = stage match {
    case Dev => new ProfileCredentialsProvider("composer")
    case _ => DefaultAWSCredentialsProviderChain.getInstance
  }

  lazy val awsRegion: Regions = Regions.EU_WEST_1

  lazy val localLogShipping: Boolean = sys.env.getOrElse("LOCAL_LOG_SHIPPING", "false").toBoolean
  lazy val loggingStreamName: Option[String] = playConfig.getOptional[String]("recipes.loggingStreamName")
  final lazy val capiApiKey: String =  {
    val home = System getProperty "user.home"
    val location = "/%s/.gu/%s.properties".format(home, app)
    val file = new File(location)

    if (file.exists) {
      val FileValue = fromFile(file).mkString.trim
      logger.info(s"contents of $location is $FileValue")
      FileValue
    } else {
      logger.warn(s"$location not found, API key will be will be ${null}")
      null
    }
  }
  val domainConfig: DomainConfig = DomainConfig(stage)
}
