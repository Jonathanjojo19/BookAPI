// Utility for sending success/failed request information

module.exports = {
    failed: (res, err) => {
        return res.status(500).send({ success: false, message: err });
    },
    success: (res, data) => {
        res.json({
            success: true,
            data: data
        });
    }
};