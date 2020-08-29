package config

import java.net.URI

import model.Stage
import model.Stage._

case class DomainConfig(
  self: URI,
  loginService: URI
)

object DomainConfig {
  def apply(stage: Stage): DomainConfig = {
    val stageDomain = stage match {
      case Dev => "local.dev-gutools.co.uk"
      case Prod => "gutools.co.uk"
    }

    def buildUri(subdomain: String): URI = new URI(s"https://$subdomain.$stageDomain")

    DomainConfig(
      buildUri("recipes"),
      buildUri("login")
    )
  }
}
