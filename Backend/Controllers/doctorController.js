import Booking from "../models/BookingSchema.js"
import Doctor from "../models/DoctorSchema.js"

export const updateDoctor = async (req, res) => {
    const id = req.params.id

    try {
        const UpdatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        res.status(200).json({ success: true, message: 'Successfully Updated', data: updateDoctor })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to Update' })
    }
}

export const deleteDoctor = async (req, res) => {
    const id = req.params.id
    try {
        await Doctor.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: 'Successfully Deleted' })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to Delete' })
    }
}
export const deleteDoctorAdmin = async (req, res) => {
    const id = req.body.id
    try {
        await Doctor.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: 'Successfully Deleted' })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to Delete' })
    }
}

export const getSingleDoctor = async (req, res) => {
    const id = req.params.id

    try {
        const doctor = await Doctor.findById(id).populate('reviews').select("-password")
        res.status(200).json({ success: true, message: 'Doctor Found', data: doctor })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'No Doctor Found' })
    }
}

export const getAllDoctor = async (req, res) => {
    const id = req.params.id

    try {
        const { query } = req.query
        let doctors;

        if (query) {
            doctors = await Doctor.find({ isApproved: 'approved', $or: [{ name: { $regex: query, $options: "i" } }, { specialization: { $regex: query, $options: "i" } }] }).select("-password")
        }
        else {
            doctors = await Doctor.find({ isApproved: "approved" }).select("-password")
        }
        res.status(200).json({ success: true, message: 'Doctors Found', data: doctors })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Not Found' })
    }
}

export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId
    try {
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor Not Found' })
        }
        const { password, ...rest } = doctor._doc;
        const appointments = await Booking.find({ doctor: doctorId })


        return res.status(200).json({ success: true, message: 'Profile Info', data: { ...rest, appointments } })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something Went Wrong' })

    }
}
export const getnotdoctors = async (req, res) => {
    try {
        const docs = await Doctor.find({ isApproved: "pending" })
        // .find({
        //       _id: { $ne: req.locals },
        //     })
        //     .populate("userId");
        return res.json(docs)

        //   return res.send(docs);
    } catch (error) {
        res.status(500).send("Unable to get non doctors");
    }
};

export const getappdoctors = async (req,res) => {
    try {
        const docs = await Doctor.find({ isApproved: "approved" })
        // .find({
        //       _id: { $ne: req.locals },
        //     })
        //     .populate("userId");
        return res.json(docs)

        //   return res.send(docs);
    } catch (error) {
        res.status(500).send("Unable to get approved doctors");
    }
}

export const acceptdoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate(
            { _id: req.body.id },
            { isApproved: "approved" }
        );

        //   const doctor = await Doctor.findOneAndUpdate(
        //     { userId: req.body.id },
        //     { isDoctor: true }
        //   );

        //   const notification = await Notification({
        //     userId: req.body.id,
        //     content: `Congratulations, Your application has been accepted.`,
        //   });

        //   await notification.save();

        return res.status(200).json({ success: true, message: "Doctor Approved Successfully" });
    } catch (error) {
        res.status(500).send("Error while sending notification");
    }
};

export const rejectdoctor = async (req, res) => {
    try {
      const details = await Doctor.findOneAndUpdate(
        { _id: req.body.id },
        { isApproved: "cancelled" }
      );
      const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });
  
    //   const notification = await Notification({
    //     userId: req.body.id,
    //     content: `Sorry, Your application has been rejected.`,
    //   });
  
    //   await notification.save();
  
      return res.status(200).json({success:true ,message:"Application rejection notification sent"});
    } catch (error) {
      res.status(500).send("Error while rejecting application");
    }
  };