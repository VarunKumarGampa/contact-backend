const express = require("express");
const router = express.Router();
const {getContact,createContact,updateContact,getContactById,deleteContact} = require("../controllers/contactContollers");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContact).post(createContact)
router.route("/:id").put(updateContact).get(getContactById).delete(deleteContact);

module.exports = router;