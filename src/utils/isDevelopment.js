export default () => {
    console.log('ISDEV', process)
    return process.env.NODE_ENV === "development";
}