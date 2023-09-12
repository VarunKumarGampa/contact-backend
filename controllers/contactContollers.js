const asycnHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

const getContact = asycnHandler(async(req,res)=>{
    const contacts = await Contact.find({user_id : req.user.id})
    res.status(200).json({contacts})
});

const createContact = asycnHandler(async(req,res)=>{
    console.log(req.body);
    const {name,email,phone} = req.body
    if(!name || !email || !phone){
        res.status(404)
        throw new Error("All feilds are mandatory!")
    }
    const contact = await Contact.create({name,email,phone,user_id:req.user.id})
    res.status(200).json(contact);
});

const updateContact = asycnHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User don't have permissions to update other contacts")
    }
    const update = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(update)
});

const getContactById = asycnHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
});

const deleteContact = asycnHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User don't have permissions to update other contacts")
    }
    await Contact.findByIdAndRemove(req.params.id);
    res.status(200).json(contact)
});

module.exports = {getContact,createContact,updateContact,getContactById,deleteContact}