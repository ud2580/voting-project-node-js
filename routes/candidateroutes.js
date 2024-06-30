const express = require('express');
const router = express.Router();

const {jwtAuthMiddleware} = require('./../jwt');
const User = require('./../model/user');
const Candidate = require('../model/candidate');


const checkAdminRole = async (userid) => {
    try {
        const user = await User.findById(userid);
        if(user.role ="admin"){
            return true;
        } // Returns true if user is admin, false otherwise
    } catch (err) {
       
        return false; // Retu rn false on error
    }
}



// POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {

        if(!(await checkAdminRole(req.user.id))) 
            return res.status(403).json({ message: "user has not in admin role"});
        
        const data = req.body // Assuming the request body contains the candidate data

        // Create a new candidate document using the Mongoose model
        const newcandidate = new Candidate(data);

        // Save the new candidate to the database
        const response = await newcandidate.save();
        console.log('data saved');


        res.status(200).json({ response: response});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.put('/:candidateid', jwtAuthMiddleware, async (req, res) => {
    try {

        if (!(await checkAdminRole(req.user.id))) 
            return res.status(403).json({ message: "user has not in admin role" });
        

        const candidateid = req.params.candidateid; // Extract the id from the URL parameter
        const updatedcandidateData = req.body; // Updated data for the person

        const response = await Candidate.findByIdAndUpdate(candidateid, updatedcandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })

        if (!response) {
            return res.status(403).json({ error: 'Person not found' });
        }

        console.log('data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:candidateid', jwtAuthMiddleware, async (req, res) => {
    try {

        if (!(await checkAdminRole(req.user.id))) 
            return res.status(403).json({ message: "user has not in admin role" });
           
        

        const candidateid = req.params.candidateid; // Extract the person's ID from the URL parameter

        // Assuming you have a Person model
        const response = await Candidate.findByIdAndDelete(candidateid);
        if (!response) 
            return res.status(403).json({ error: 'Person not found' });
        
        console.log('data delete');
        res.status(200).json({ message: 'person Deleted Successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/voter/:candidateid',jwtAuthMiddleware, async(req,res)=>{
    candidateid=req.params.candidateid;
    userid=req.user.id;
    try{

        const candidate= await Candidate.findById(candidateid);
        if(!candidate){
            return res.status(404).json({messege:'candidate not found'})
        }
        const user= await User.findById(userid);
        if(!user){
            return res.status(404).json({messege:'user not found'})
        }
        if(user.isvoted){
            return res.status(400).json({messege:'user alredy given vote'})

        }
        if(user.role=="admin"){
            return res.status(403).json({messege:'admin not allowed for vote'})
        }

        candidate.votes.push({user: userid});
        candidate.votecount++;
        await candidate.save();

        user.isvoted=true;
        await user.save();

        res.status(200).json({ response: 'vote record successfully' });

    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    

});

router.get('/vote/count',async(req,res)=> {
    try{
     const candidates = await Candidate.find().sort({votecount:'desc' });
     const records = candidates.map(candidate => ({
        party: candidate.party, // Assuming party is a field in your Candidate schema
        count: candidate.votecount
    }));

     res.json(records);

    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/list',async(req,res)=> {
    try{
     const candidates = await Candidate.find();
     const records = candidates.map(candidate => ({
        name: candidate.name, // Assuming party is a field in your Candidate schema
        party: candidate.party,
        age: candidate.age
    }));

     res.json(records);

    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;