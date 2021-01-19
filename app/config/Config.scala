package config

import java.io.File

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, DefaultAWSCredentialsProviderChain}
import com.amazonaws.regions.Regions
import model.Stage
import model.Stage.Dev
import play.api.{Configuration, Logging}

import scala.io.Source.fromFile

import com.gu.{AppIdentity, AwsIdentity}
import com.gu.conf.{ConfigurationLoader, S3ConfigurationLocation}
import com.typesafe.config.{Config => Config_}

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
  
  val identity = AppIdentity.whoAmI(defaultAppName = "recipes")
  val config: Config_ = ConfigurationLoader.load(identity) {
    case AwsIdentity(app, stack, stage, _) => S3ConfigurationLocation("recipes-dist", s"$stage/$stack/$app.conf")
  }
  logger.info(config.toString())
  final lazy val capiApiKey: String =  config.getString("capiKey")
  
  val domainConfig: DomainConfig = DomainConfig(stage)
}
