package config

import model.Stage
import model.Stage.{Dev, Prod}

case class PanDomainConfig(
  settingsFileKey: String,
  settingsBucket: String
)

object PanDomainConfig {
  def apply(stage: Stage): PanDomainConfig = {
    val settingsFileKey = stage match {
      case Dev => "local.dev-gutools.co.uk.settings.public"
      case Prod => "gutools.co.uk.settings.public"
    }

    PanDomainConfig(settingsFileKey, "pan-domain-auth-settings")
  }
}
