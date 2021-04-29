package config

import java.io.File

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProvider, DefaultAWSCredentialsProviderChain}
import com.amazonaws.regions.Regions
import model.Stage
import model.Stage.Dev
import play.api.{Configuration, Logging}

import scala.io.Source.fromFile

import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import com.gu.conf.{ConfigurationLoader, S3ConfigurationLocation, FileConfigurationLocation}
import com.typesafe.config.{Config => Config_}

import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProvider => AwsCredentialsProviderV2,
  ProfileCredentialsProvider => ProfileCredentialsProviderV2,
  DefaultCredentialsProvider => DefaultCredentialsProviderV2
}

class Config(playConfig: Configuration) extends Logging {

  lazy val stack: String = playConfig.get[String]("stack")
  lazy val app: String = playConfig.get[String]("app")
  lazy val tableName: String = playConfig.get[String]("tableName")
  lazy val hashKey: String = playConfig.get[String]("hashKey")
  lazy val rangeKey: String = playConfig.get[String]("rangeKey")

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

  lazy val awsCredentialsV2: AwsCredentialsProviderV2 = stage match {
     case _: DevIdentity => ProfileCredentialsProviderV2.create("composer")
      case _ => DefaultCredentialsProviderV2.create()
  }

  lazy val awsRegion: Regions = Regions.EU_WEST_1

  lazy val localLogShipping: Boolean = sys.env.getOrElse("LOCAL_LOG_SHIPPING", "false").toBoolean
  lazy val loggingStreamName: Option[String] = playConfig.getOptional[String]("recipes.loggingStreamName")

  lazy val identity = stage match {
    case Dev => new DevIdentity(app)
    case _ => new AwsIdentity(app, stack, stage.toString().toUpperCase(),  "eu-west-1")
  }

  // val identity = AppIdentity.whoAmI(defaultAppName = "recipes")
  lazy val home = System getProperty "user.home"
  val config: Config_ = ConfigurationLoader.load(identity, credentials = awsCredentialsV2) {
    case AwsIdentity(app, stack, stage, _) => S3ConfigurationLocation("recipes-dist", s"$stage/$stack/$app.conf", "eu-west-1")
    case _ => FileConfigurationLocation( new File(s"$home/.gu/$app.conf"))
  }
  // logger.info(config.toString())
  final lazy val capiApiKey: String =  config.getString("capiKey")
  lazy val dbUrl = stage match {
    case Dev => config.getString("dbUrl")
    case _ => null
  }
  val domainConfig: DomainConfig = DomainConfig(stage)
}
