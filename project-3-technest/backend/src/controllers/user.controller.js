const userService = require("../services/user.service");

const userController = {
  registerCustomer: async (req, res) => {
      const response = await userService.registerCustomer(req.body);

      if (!response.success) {
        if (response.code === "EMAIL_ALREADY_EXISTS") {
          return res.status(409).json({
            success: response.success,
            message: response.message,
          });
        }
      }

      return res.status(201).json({
        success: response.success,
        message: response.message,
        data: response.data,
      }) 
  },
};


module.exports=userController;