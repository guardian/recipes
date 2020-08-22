package model

import org.scalatest.FunSuite

class StageTest extends FunSuite {

  test("testWithNameOrDev") {
    assert(Stage.withNameOrDev("invalid") == Stage.Dev)
    assert(Stage.withNameOrDev("dev") == Stage.Dev)
    assert(Stage.withNameOrDev("DEV") == Stage.Dev)
    assert(Stage.withNameOrDev("PROD") == Stage.Prod)
    assert(Stage.withNameOrDev("prod") == Stage.Prod)
  }

}
