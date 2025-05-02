const MemberShip = require("../models/MemberShip");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");


const createMemberShip = async (req, res) => {
    try {
        const { membershipName, membershipDescription, membershipType, membershipPeriod, isJoinFee
            , charge, isStartDateOfPurches, cancellationPolicy, cancellationDuration
         } = req.body;
          
        let membershipPhoto = "";

        if (req.file) {
          membershipPhoto = req.file.path
            .replace(path.resolve(__dirname, "..") + path.sep, "")
            .replace(/\\/g, "/");
        }
        console.log(req.body);

        if( !membershipName, !membershipDescription, !membershipType, !membershipPeriod, !charge, !cancellationPolicy, !cancellationDuration){
            return res.status(400).json({ message: "Fill all the required fields" });
        }

        // Check if the membership name already exists
        const existingMembership = await MemberShip.findOne({ membershipName });

        if (existingMembership) {
            return res.status(400).json({ message: "A membership with this name already exists" });
        }

        const response = await MemberShip.create({
            membershipName, membershipDescription, membershipType, membershipPeriod, isJoinFee
            , charge, isStartDateOfPurches, cancellationPolicy, cancellationDuration,
            membershipPhoto
        })

        res.status(201).json({ message: "Membership created successfully", data: response});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
};

const getAllMembership = async (req, res) => {
    try {
        const response = await MemberShip.find()
        res.status(201).json({ message: "Retrieved all membership data successfully", data: response});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateMembership = async (req, res) => {
  try {
      const { id } = req.params;
      const {
          membershipName,
          membershipDescription,
          membershipType,
          membershipPeriod,
          isJoinFee,
          charge,
          isStartDateOfPurches,
          cancellationPolicy,
          cancellationDuration,
          existingPhotoPath,
      } = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ message: "Invalid membership ID" });
      }

      // Check if membership exists
      const existingMembership = await MemberShip.findById(id);
      if (!existingMembership) {
          return res.status(404).json({ message: "Membership not found" });
      }


            // Check if the membership name already exists (excluding the current membership)
            const membershipWithSameName = await MemberShip.findOne({
              membershipName,
              _id: { $ne: id } // Exclude the current membership from the check
          });
    
          if (membershipWithSameName) {
              return res.status(400).json({ message: "A membership with this name already exists" });
          }
      

      // Determine photo path
      let membershipPhoto = existingPhotoPath || existingMembership.membershipPhoto;

      if (req.file) {
          membershipPhoto = req.file.path
              .replace(path.resolve(__dirname, "..") + path.sep, "")
              .replace(/\\/g, "/");
      }

      const updatedData = {
          membershipName,
          membershipDescription,
          membershipType,
          membershipPeriod,
          isJoinFee,
          charge,
          isStartDateOfPurches,
          cancellationPolicy,
          cancellationDuration,
          membershipPhoto,
      };

      // Update the document
      const updatedMembership = await MemberShip.findByIdAndUpdate(id, updatedData, {
          new: true,
          runValidators: true,
      });

      res.status(200).json({
          message: "Membership updated successfully",
          data: updatedMembership,
      });

  } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteMembership = async (req, res) => {
    try {
      const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ message: "Membership not found" });
        }      
  
      const membership = await MemberShip.findById(id);
      if (!membership) {
        return res.status(404).json({ message: "Membership not found" });
      }
  

      if (membership.membershipPhoto) {
        const filePath = path.join(__dirname, "..", membership.membershipPhoto);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
  
      await MemberShip.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Membership deleted successfully" });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: "Server error", error });
    }
  };

  const getAllMembershipNames = async (req, res) => {
    try {
      const memberships = await MemberShip.find({}, 'membershipName');
      const names = memberships.map(m => m.membershipName); 
  
      res.status(200).json({
        message: "Retrieved all membership names successfully",
        data: names
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  };

  const getMembershipCount = async (req, res) => {
      try {
        const count = await MemberShip.countDocuments(); 
        res.status(200).json({ 
          message: "Membership count retrieved successfully", 
          membershipCount: count 
        });
      } catch (error) {
        console.error("Error getting membership count:", error);
        res.status(500).json({ message: "Server error", error });
      }
    };



module.exports = { createMemberShip, getAllMembership, updateMembership, deleteMembership, getAllMembershipNames, getMembershipCount };