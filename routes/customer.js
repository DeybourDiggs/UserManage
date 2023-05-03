const express = require('express')
const router = express.Router();
const customerController = require('../controllers/customerController')



router.get("/", customerController.homepage)

router.get("/add", customerController.addCustomer)
router.post("/add", customerController.postCustomer)
router.get("/view/:id", customerController.viewCustomer)

router.get("/edit/:id", customerController.editCustomer)
router.put("/edit/:id", customerController.putCustomer)
router.delete("/edit/:id", customerController.deleteCustomer)


router.post("/search", customerController.searchCustomer)



module.exports = router;