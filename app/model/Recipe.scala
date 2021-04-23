package model
import play.api.{Logger, Logging}
import play.api.libs.json.{JsError, JsSuccess, JsValue, Json, OFormat}

case class Quantity(absolute: Option[String], from: Option[String], to: Option[String])
case class Ingredient(item: String, unit: String, quantity: Quantity, comment: Option[String], text: String)
case class IngredientsList(ingredients: List[Ingredient])
case class Time(instruction: String, quantity: String, unit: String)
case class Recipe(
  recipeId: Long,
  path: String,
  serves: Option[String],
  ingredients_lists: List[IngredientsList],
  steps: List[String],
  cuisines: List[String],
  recipes_title: Option[String],
  time: List[Time],
  credit: Option[String],
  ingredient_tags: List[String],
  occasion: List[String],
  meal_type: List[String])

object Quantity {
  implicit val formats: OFormat[Quantity] = Json.format[Quantity]
}

object Ingredient {
  implicit val formats: OFormat[Ingredient] = Json.format[Ingredient]
}

object IngredientsList {
  implicit val formats: OFormat[IngredientsList] = Json.format[IngredientsList]
}

object Time {
  implicit val formats: OFormat[Time] = Json.format[Time]
}

object Recipe extends Logging {
  implicit val formats: OFormat[Recipe] = Json.format[Recipe]

  def parseRecipe(json: JsValue)= {
    Json.fromJson[Recipe](json) match {
      case JsSuccess(value, path) =>
        Some(value)
      case JsError(errors) =>
        errors.foreach{e =>
          logger.error(s"Parse error ${e}")
        }
        None
    }
  }
}
