const db = require('../models');
const Feedback = db.Feedback;

async function getReviewById(req, res,next) {
  try {
        const reviewid = req.params.id
        const review = await Feedback.findById(reviewid).populate("court", "court_name").populate("user","name");
        res.status(200).json({review : review})
  } catch (error) {
      next(error)
  }
}

async function getReviewByCourtId(req, res, next) {
    try {
        const courtId = req.params.bid
        console.log(courtId);

        // Thay đổi cách lấy dữ liệu feedback
        const listReview = await Feedback.find({ court: courtId }).populate("court", "court_name").populate("user", "name");
        console.log(listReview)
        const listfromd = listReview.map(r => {
            return {
                feedback_id: r.id,
                content: r.content,
                userName: r.user.name,
                userId: r.user._id, 
                courtName: r.court.court_name // Có thể bỏ thuộc tính này nếu không cần thiết
            }
        })
        res.status(200).json(listfromd)

    } catch (error) {
        console.error("Error fetching reviews:", error);
        next(error);
    }
}



async function getAllReviews (req, res,next) {
    try {
        const reviews = await Feedback.find().populate("court", "court_name").populate("user","name");
        res.status(200).send(reviews)
    } catch (error) {
        next(error)
    }
}

async function addReview (req, res,next) {
    try {       

        const courtId = req.params.id

        
        const userId = req.body.user
        if (!userId) return res.status(401).send('Unauthorized');
        
        
        const newReview = new Feedback({
            user: req.body.user,
            court: courtId,
            content: req.body.review
        });
        const review = await Feedback.create(newReview);
        res.status(201).send({message: 'Feedback created successfully', review});
    } catch (error) {
        next(error)
    }
}

async function updateReview(req, res, next) {
    try {
      const reviewId = req.params.id;
      const { content } = req.body; // Chỉ lấy nội dung để cập nhật
      
      // Tìm review trước để kiểm tra quyền (nếu cần)
      const existingReview = await Feedback.findById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      }
      
      // Cập nhật nội dung review
      existingReview.content = content;
      await existingReview.save();
      
      // Lấy review đã cập nhật với thông tin đầy đủ
      const updatedReview = await Feedback.findById(reviewId)
        .populate("user", "name")
        .populate("court", "court_name");
      
      res.status(200).json({ 
        message: 'Cập nhật đánh giá thành công', 
        review: {
          feedback_id: updatedReview._id,
          content: updatedReview.content,
          userName: updatedReview.user.name,
          userId: updatedReview.user._id,
          courtName: updatedReview.court.court_name
        }
      });
    } catch (error) {
      console.error("Error updating review:", error);
      next(error);
    }
  }

async function deleteReview(req, res, next){
  try {
    const reviewId = req.params.id
    const deleteR = await Feedback.findByIdAndDelete(reviewId)
   res.status(204).send({message : "Review deleted successfully"})
  } catch (error) {
    next(error)
  }
}

const reviewController = {
    getReviewById,
    getAllReviews,
    addReview,
    updateReview,
    deleteReview,
    getReviewByCourtId
}
module.exports = reviewController;