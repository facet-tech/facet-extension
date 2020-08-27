// console.log('@highlighter');
// window.highlightMode = false;

// var onMouseEnterHandle = function (event) {
//     event.target.style.border = '1px solid black';
//     event.target.style.cursor = "pointer";
// };

// var onMouseLeaveHandle = function (event) {
//     event.target.style.border = "none";
// }

// var onMouseClickHandle = function (event) {
//     console.log('mode', window.highlightMode);
//     console.log('@CLICK', event.target.id);
//     // event.preventDefault();
//     // event.stopPropagation();
//     if (!event.target.id) return;
//     window.selectedDOM = event.target.id;
//     window.postMessage(event.target.id, "*");
//     // onAddElement();
// }

// // flag: true => add event; else remove event
// const updateEvents = (flag) => {


//     //simple vers:
//     [...document.querySelectorAll('body *')].forEach(e => {
//          if (flag) {
//                 e.addEventListener("click", onMouseClickHandle, false);
//                 e.addEventListener("mouseenter", onMouseEnterHandle, false);
//                 e.addEventListener("mouseleave", onMouseLeaveHandle, false);
//             } else {
//                 e.removeEventListener("click", onMouseClickHandle, false);
//                 e.removeEventListener("mouseenter", onMouseEnterHandle, false);
//                 e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
//             }
//     })

    // [...document.querySelectorAll('body * > :not(#root)')].
    //     filter(e => ![...document.querySelectorAll("#root *")].includes(e)).forEach(e => {
            
    //         console.log('kappa!')
    //         if (flag) {
    //             e.addEventListener("click", onMouseClickHandle, false);
    //             e.addEventListener("mouseenter", onMouseEnterHandle, false);
    //             e.addEventListener("mouseleave", onMouseLeaveHandle, false);
    //         } else {
    //             e.removeEventListener("click", onMouseClickHandle, false);
    //             e.removeEventListener("mouseenter", onMouseEnterHandle, false);
    //             e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
    //         }
    //         // e.removeEventListener("click", onMouseClickHandle, false);
    //         // e.removeEventListener("mouseenter", onMouseEnterHandle, false);
    //         // e.removeEventListener("mouseleave", onMouseLeaveHandle, false);

    //     });
// }
// updateEvents(true);

// // try {
// //     console.log('RUNNING SCRIPT @LOAD');
// //     //moving #root into body

// //     // $("body").prepend($("#root"))
// //     // var iframe = document.getElementById("fixed-container");
// //     var innerDoc = document;
// //     // var body = innerDoc.body;
// //     // var root = innerDoc.getElementById('root');
// //     // body.prepend(root);
// //     let count = 0;

// //     [...document.querySelectorAll('body * > :not(#root)')].
// //         filter(e => ![...document.querySelectorAll("#root *")].includes(e)).forEach(e => {
// //             console.log('kappa!')
// //             e.addEventListener("click", onMouseClickHandle, false);
// //             e.addEventListener("mouseenter", onMouseEnterHandle, false);
// //             e.addEventListener("mouseleave", onMouseLeaveHandle, false);

// //             // e.removeEventListener("click", onMouseClickHandle, false);
// //             // e.removeEventListener("mouseenter", onMouseEnterHandle, false);
// //             // e.removeEventListener("mouseleave", onMouseLeaveHandle, false);

// //         });
// //     console.log('count!', count);console.log('count!', count);
// // } catch (e) {
// //     console.log('@CATCH', e)
// // }

// export { updateEvents };