package config

import java.io.File

import model.Stage
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

  lazy val localLogShipping: Boolean = sys.env.getOrElse("LOCAL_LOG_SHIPPING", "false").toBoolean
}
