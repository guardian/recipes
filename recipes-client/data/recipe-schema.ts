export default {
  "type": "object",
  "required": [],
  "properties": {
    "path": {
      "type": "string"
    },
    "recipes_title": {
      "type": "string"
    },
    "serves": {
      "type": "string"
    },
    "time": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [],
        "properties": {
          "instruction": {
            "type": "string"
          },
          "quantity": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          }
        }
      }
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "credit": {
      "type": "string"
    },
    "ingredients_lists": {
      "type": "object",
      "required": [],
      "properties": {
        "title": {
          "type": "string"
        },
        "ingredients": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [],
              "properties": {
                "text": {
                  "type": "string"
                },
                "item": {
                  "type": "string"
                },
                "unit": {
                  "type": "string"
                },
                "comment": {
                  "type": "string"
                },
                "quantity": {
                  "type": "object",
                  "required": [],
                  "properties": {
                    "absolute": {
                      "type": "string"
                    },
                    "from": {
                      "type": "string"
                    },
                    "to": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "occasion": {
      "type": "string"
    },
    "cuisines": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "meal_type": {
      "type": "string"
    },
    "ingredient_tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}