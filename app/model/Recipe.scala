package model
import play.api.{Logger, Logging}
import play.api.libs.json.{JsError, JsSuccess, JsValue, Json, OFormat, Writes}
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import scala.collection.immutable.{Map => MMap}

case class Quantity(absolute: Option[String], from: Option[String], to: Option[String])
case class Ingredient(item: String, unit: String, quantity: Quantity, comment: Option[String], text: String)
case class IngredientsList(ingredients: List[Ingredient], title: String)
case class Time(instruction: String, quantity: String, unit: String)
case class Recipe(
  recipeId: Long,
  path: String,
  serves: String,
  ingredients_lists: List[IngredientsList],
  steps: List[String],
  cuisines: List[String],
  recipes_title: Option[String],
  time: List[String], //List[Time],
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

  // def toMMap(): MMap[String, AttributeValue] = {
  //     return MMap(
  //     "recipeId" -> new AttributeValue(Recipe.recipeId),
  //     "path" -> new AttributeValue(Recipe.path),
  //     "serves" -> new AttributeValue(Recipe.serves),
  //     "ingredients_lists" -> new AttributeValue(recipe.ingredients_lists),
  //     "steps" -> new AttributeValue(recipe.steps),
  //     "cuisines" -> new AttributeValue(recipe.cuisines),
  //     "recipes_title" -> new AttributeValue(recipe.recipes_title),
  //     "time" -> new AttributeValue(recipe.time),
  //     "credit" -> new AttributeValue(recipe.credit),
  //     "ingredient_tags" -> new AttributeValue(recipe.ingredient_tags),
  //     "occasion" -> new AttributeValue(recipe.occasion),
  //     "meal_type" -> new AttributeValue(recipe.meal_type),
  //     ).asJava;
  // }
   //   for (String[] field : extra_fields) {
      //       item_values.put(field[0], new AttributeValue(field[1]));
      //   }

  implicit val recipeWrites = new Writes[Recipe] {
    def writes(recipe: Recipe) = Json.obj(
        "recipeId" -> recipe.recipeId,
        "path" -> recipe.path,
        "serves" -> recipe.serves,
        "ingredients_lists" -> recipe.ingredients_lists,
        "steps" -> recipe.steps,
        "cuisines" -> recipe.cuisines,
        "recipes_title" -> recipe.recipes_title,
        "time" -> recipe.time,
        "credit" -> recipe.credit,
        "ingredient_tags" -> recipe.ingredient_tags,
        "occasion" -> recipe.occasion,
        "meal_type" -> recipe.meal_type,
    )
  }



}

