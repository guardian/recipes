package model
import play.api.{Logger, Logging}
import play.api.libs.json.{JsError, JsSuccess, JsValue, Json, OFormat, Writes}
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import scala.collection.immutable.{Map => MMap}

case class Quantity(absolute: Option[String], from: Option[String], to: Option[String])
case class Range(min: Double, max: Double)
case class Ingredient(name: String, amount: Option[Range], unit: Option[String], ingredientId: Option[String], prefix: Option[String], suffix: Option[String], optional: Option[Boolean], text: Option[String])
case class IngredientsList(recipeSection: String, ingredientsList: List[Ingredient])
case class Serves(amount: Range, unit: String, text: Option[String])
case class Instruction(stepNumber: Int, description: String, images: Option[List[String]])
case class Timing(qualifier: String, durationInMins: Int, text: Option[String])

case class Recipe(
  isAppReady: Boolean,
  id: String,
  composerId: Option[String],
  webPublicationDate: Option[String],
  canonicalArticle: Option[String],
  title: Option[String],
  description: Option[String],
  serves: Option[List[Serves]],
  ingredients: List[IngredientsList],
  instructions: List[Instruction],
  cuisineIds: List[String],
  timings: List[Timing],
  contributors: List[String],
  byline: List[String],
  celebrationIds: List[String],
  mealTypeIds: List[String],
  utensilsAndApplianceIds: List[String],
  suitableForDietIds: List[String],
  techniquesUsedIds: List[String],
  difficultyLevel: Option[String],
)

object Quantity {
  implicit val formats: OFormat[Quantity] = Json.format[Quantity]
}

object Ingredient {
  implicit val formats: OFormat[Ingredient] = Json.format[Ingredient]
}

object Range {
  implicit val formats: OFormat[Range] = Json.format[Range]
}

object Serves {
  implicit val formats: OFormat[Serves] = Json.format[Serves]
}

object IngredientsList {
  implicit val formats: OFormat[IngredientsList] = Json.format[IngredientsList]
}

object Timing {
  implicit val formats: OFormat[Timing] = Json.format[Timing]
}

object Instruction {
  implicit val formats: OFormat[Instruction] = Json.format[Instruction]
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

  implicit val recipeWrites = new Writes[Recipe] {
    def writes(recipe: Recipe) = Json.obj(
        "isAppReady" -> recipe.isAppReady,
        "id" -> recipe.id,
        "serves" -> recipe.serves,
        "ingredients" -> recipe.ingredients,
        "instructions" -> recipe.instructions,
        "cuisineIds" -> recipe.cuisineIds,
        "title" -> recipe.title,
        "description" -> recipe.description,
        "timings" -> recipe.timings,
        "contributors" -> recipe.contributors,
        "byline" -> recipe.byline,
        "celebrationIds" -> recipe.celebrationIds,
        "mealTypeIds" -> recipe.mealTypeIds,
        "utensilsAndApplianceIds" -> recipe.utensilsAndApplianceIds,
        "techniquesUsedIds" -> recipe.techniquesUsedIds,
        "difficultyLevel" -> recipe.difficultyLevel,
    )
  }



}

