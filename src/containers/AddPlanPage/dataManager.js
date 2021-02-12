import PlanServiceFile from "../../service/PlanService";
const PlanService = new PlanServiceFile();

export default class AddPlanManager {
  getPlanCategories() {
    return PlanService.getPlanCategoriesService({ get_all: true, page: 1 });
  }

  addPlanValidator(inputs) {
    let {
      planCategoryID,
      name,
      description,
      planPrices,
      planServices
    } = inputs;

    if (!planCategoryID) {
      return {
        status: false,
        message: "Plan Category is required."
      };
    }
    if (!name) {
      return {
        status: false,
        message: "Plan Name is required."
      };
    }
    if (!description) {
      return {
        status: false,
        message: "Plan Description is required."
      };
    }
    if (planServices) {
      if (!planServices.length) {
        return {
          status: false,
          message: "Atleast one Plan Service is required."
        };
      } else {
        for (let service of planServices) {
          if (!service.name || !service.description) {
            return {
              status: false,
              message: "Plan Service should have a name and description."
            };
          }
        }
      }
    }
    if (planPrices) {
      if (!planPrices.length) {
        return {
          status: false,
          message: "Atleast one Plan Price is required."
        };
      } else {
        let INRExists = false;
        for (let currency of planPrices) {
          for (let price of currency.data) {
            if (!price.price || !price.duration || !price.currency) {
              return {
                status: false,
                message:
                  "Plan Price should have a currency, price and description."
              };
            } else if(price.currency === "INR") {
              INRExists = true;
            }
          }
        }

        if(!INRExists) {
          return {
            status: false,
            message:
              "Atleast one Plan Price should be in INR."
          };
        }
      }
    }

    return { status: true };
  }

  addPlan(inputs) {
    let {
      planCategoryID,
      name,
      description,
      planPrices,
      planServices,
      image_uuid
    } = inputs;

    let payload = {
      plan_category_id : planCategoryID,
      image_uuid,
      name,
      description,
      plan_services : planServices
    };

    if(planPrices.length) {
      payload["plan_prices"] = []
      for(let currency of planPrices) {
        for(let price of currency.data) {
          payload.plan_prices.push(price)
        }
      }
    }

    return PlanService.addPlan(payload);
  
  }
}
