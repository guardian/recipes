package model

import enumeratum.EnumEntry.Uppercase
import enumeratum._

sealed trait Stage extends EnumEntry

object Stage extends PlayEnum[Stage] with Uppercase {
  case object Dev extends Stage
  case object Prod extends Stage

  val values = findValues

  def withNameOrDev(value: String): Stage = withNameInsensitiveOption(value).getOrElse(Dev)
}
