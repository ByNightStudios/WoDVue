import OrderServiceFile from "../../service/OrderService";
const OrderService = new OrderServiceFile();

class OrdersManager {
    getOrderByIDData(inputs) {
      let payload = {
        
        order_id : inputs.order_id
      };
      return OrderService.getOrderByIDService(payload);
    }
  }
  
  export default OrdersManager;