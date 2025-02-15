const { model } = require('mongoose');
const connectToDatabase = require('../database/database');
const DeliveryForm = require('../models/deliveryForm');

const { getCustomer } = require('./customer');
const { getLocation } = require('./locations');

const createDeliveryForm = async (requestBody) => {
    try {
        await connectToDatabase();

        const { createdBy, pickup, itemType, message } = requestBody;

        if (!createdBy) throw new Error('User must be registered to create a delivery form');
        if (!itemType) throw new Error('Item type is required');

        // Process pickup location (saved or new)
        let pickupData = await processLocation(pickup);

        //check if user is a registered customer
        const customer = await getCustomer(createdBy);
        if (!customer) throw new Error('Customer not found');

        // Create a delivery form (recipient will be updated later)
        const newDeliveryForm = new DeliveryForm({
            createdBy,
            pickup: pickupData,
            itemType,
            message: message || '',
            recipient: {}, // Empty recipient, will be updated later
        });

        const savedForm = await newDeliveryForm.save();
        return await getDeliveryForm(savedForm._id);
    } catch (error) {
        console.error('Error creating delivery form:', error);
        throw new Error(error.message);
    }
};

const getDeliveryForm = async (formId) => {
    try {
        await connectToDatabase();

        const form = await DeliveryForm.findById(formId)
            .populate('createdBy') // Fetch user details
            .populate('pickup.savedLocation') // Populate pickup if from saved location
            .populate('recipient.savedLocation') // Populate recipient if from saved location
            .populate({
                path: 'recipient.customer',
                populate: {
                    path: 'user', // Populate user details
                    model: 'User',
                }
            }) // Populate recipient if registered customer
            .populate('itemType'); // Fetch item type

        if (!form) throw new Error('Delivery form not found');

        return form;
    } catch (error) {
        console.error('Error fetching delivery form:', error);
        throw new Error(error.message);
    }
};

const updateDeliveryData = async (formId, recipient) => {
    try {
        await connectToDatabase();

        let recipientData = await processRecipient(recipient);

        const updatedForm = await DeliveryForm.findByIdAndUpdate(
            formId,
            { recipient: recipientData },
            { new: true } // Return the updated document
        )
            .populate('recipient.savedLocation', 'name address') // Populate saved recipient location
            .populate('recipient.customer', 'name email') // Populate customer data
            .populate('itemType', 'name'); // Populate item type details

        if (!updatedForm) throw new Error('Delivery form not found');

        return updatedForm;
    } catch (error) {
        console.error('Error updating delivery data:', error);
        throw new Error(error.message);
    }
};

// Helper function to process pickup location
const processLocation = async (location) => {
    if (location.savedLocation) {
        // User selected a saved location, verify it exists
        const savedLocation = await getLocation(location.savedLocation);
        if (!savedLocation) throw new Error('Selected location does not exist');
        return { savedLocation: savedLocation._id };
    } else {
        // User entered a new location
        return {
            contactName: location.contactName,
            contactNo: location.contactNo,
            address: location.address,
            unitNo: location.unitNo || '',
            note: location.note || '',
        };
    }
};

// Helper function to process recipient data (only used in updateDeliveryData)
const processRecipient = async (recipient) => {
    if (recipient.savedLocation) {
        // If recipient selected a saved location, validate it
        const savedLocation = await getLocation(location.savedLocation);
        if (!savedLocation) throw new Error('Selected recipient location does not exist');
        return { savedLocation: savedLocation._id };
    } else {
        // Check if recipient is a registered customer
        const customer = await getCustomer(recipient.customer);
        return {
            contactName: recipient.contactName,
            contactNo: recipient.contactNo,
            address: recipient.address,
            unitNo: recipient.unitNo || '',
            note: recipient.note || '',
            customer: customer ? customer._id : undefined, // Map customer if registered
        };
    }
};

module.exports = { createDeliveryForm, getDeliveryForm, updateDeliveryData };
