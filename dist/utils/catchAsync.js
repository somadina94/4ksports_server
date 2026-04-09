const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        if (err instanceof Error) {
            next(err);
        }
        else {
            next(new Error(String(err)));
        }
    });
};
export default catchAsync;
//# sourceMappingURL=catchAsync.js.map