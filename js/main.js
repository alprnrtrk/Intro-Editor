// static values

// element schemes
const row = '<div class="row selectable x-center y-center" data-role="selectable"></div>';
const col = '<div class="col selectable x-center y-center" data-role="selectable"></div>';
const img = '<img data-role="imgSelect" class="img placeholder selectable" src="">';
const text = '<h2 data-role="textSelect" style="font-size: 20px; font-weight: 400; margin-top: 0px; margin-bottom: 0px; color: #00000;" class="selectable text placeholder" contenteditable="true">test</h2>'
const accept = '<button class="button" data-role="accept"><i class="fa-solid fa-check"></i></button>';
const deny = '<button class="button" data-role="deny"><i class="fa-solid fa-xmark"></i></button>';
const mobileInvisible = '<span data-role="deleteFlag" class="flags mobile-invisible">Mobile Gizli</span>'
const link = '<a href="javascript:void(0)" data-role="linkSelect" class="link placeholder selectable"></a>'

// static elements
const grid = $('.grid');

// limit values
const rowLimit = 6;
const colLimit = 6;

//selected item
var selectedItem = [];
var selectedText = "";
var selectedImg = "";
var selectedLink = "";
var currentRow = "";

//states
var areaSelection = false;
var multipleSelection = false;
var movmentMode = false;
var canSelect = true;

//file
var exportFile = "";

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

//data-role listeners
$(document).ready(function () {
    $(document).on("click", "[data-role]", function () {
        // value of the button role
        let role = $(this).attr("data-role");

        // global counter list updater
        var globalCounter = [];
        $(document).find(".row").each(function () {
            // get object of an row
            var r = $(this);
            // and get how many col inside of it 
            var c = $(this).find(".col").length;
            // create an object for array store 2 value we wanted
            var rowData = {
                rowItem: r,
                colCount: c
            }
            // and add that object to the array
            globalCounter.push(rowData);
        })
        // get the type of the element and set curret row
        if ($(selectedItem[0]).hasClass("row")) {
            // if its row get the row index 
            currentRow = globalCounter[$(selectedItem[0]).index()];
        } else {
            // if its col get the parent index which is row
            currentRow = globalCounter[$(selectedItem[0]).parent().index()];
        }
        // row adding funciton
        if (role == "addRow" && globalCounter.length < rowLimit) {
            $(grid).append($(row).removeClass("selectable").attr("data-role","").append($(col)));
        }
        // col adding function
        else if (role == "addColmn" && selectedItem != "" && currentRow.colCount < colLimit) {
            // if user select row add cols directly inside of it 
            if ($(selectedItem[0]).hasClass("row")) {
                if (selectedItem.length <= 1) {
                    $(selectedItem[0]).append($(col));

                    // remove previus seletion effects and disable rows selectable role 
                    $(selectedItem[0]).removeClass("selectable active").attr("data-role", "");
                } else {
                    let i = 0;

                    while (i < selectedItem.length) {
                        $(selectedItem[i]).append($(col));

                        i++;

                        // remove previus seletion effects and disable rows selectable role 
                        $(selectedItem[0]).removeClass("selectable active").attr("data-role", "");
                        $(selectedItem[i]).removeClass("selectable active").attr("data-role", "");
                    }
                }
            }
            // if user select col element thats mean user want to add col beside of an selected element thats why we adding to parent of the col element which is row
            else if ($(selectedItem[0]).hasClass("col")) {
                $(selectedItem[0]).parent().append($(col));
                // remove previus selected element active status
                $(selectedItem[0]).removeClass("active");
            }
        }
        // selecting function
        else if (role == "selectable" && canSelect == true) {
            // if user press using area selection mode 
            if (areaSelection) {
                // is user select a element before
                if (selectedItem.length > 0) {
                    // add second selected element to the array
                    if (selectedItem[0].hasClass("col")) {
                        if (currentRow.rowItem.index() == $(this).parent().index()) {
                            selectedItem.push($(this));
                        }
                    } else {
                        selectedItem.push($(this));
                    }

                    // get first and second elements indexes
                    let i = selectedItem[0].index();
                    let k = selectedItem[1].index();

                    // if selected element type is row
                    if ($(selectedItem[0]).hasClass("row")) {
                        // if first elements index is smaller then second
                        if (i <= k) {
                            // loop as much how much diffrences between two selected elements index
                            while (i <= k) {
                                // add every element between first two selected element to the array and add active status
                                selectedItem.push($(grid).find(".row:nth-child(" + (i + 1) + ")"));
                                $(grid).find(".row:nth-child(" + (i + 1) + ")").addClass("active");
                                i += 1;
                            }
                        } else {
                            while (k <= i) {
                                selectedItem.push($(grid).find(".row:nth-child(" + (k + 1) + ")"));
                                $(grid).find(".row:nth-child(" + (k + 1) + ")").addClass("active");
                                k += 1;
                            }
                        }

                    } else {
                        if (i <= k) {
                            while (i <= k) {
                                selectedItem.push($(currentRow.rowItem).find(".col:nth-child(" + (i + 1) + ")"));
                                $(currentRow.rowItem).find(".col:nth-child(" + (i + 1) + ")").addClass("active");

                                i += 1;
                            }
                        }
                        else if (k <= i) {
                            while (k <= i) {
                                selectedItem.push($(currentRow.rowItem).find(".col:nth-child(" + (k + 1) + ")"));
                                $(currentRow.rowItem).find(".col:nth-child(" + (k + 1) + ")").addClass("active");

                                k += 1;
                            }
                        }
                    }
                } else {
                    selectedItem.push($(this));
                }
                selectedItem.splice(0, 2);
            }
            else if (multipleSelection == true) {
                if (movmentMode == false) {
                    if ($(selectedItem[0]).hasClass("col")) {
                        if (selectedItem.length <= 0) {
                            selectedItem.push($(this));
                            $(this).addClass("active");
                        } else if (currentRow.rowItem.index() == $(this).parent().index()) {
                            selectedItem.push($(this));
                            $(this).addClass("active");
                        }
                    } else {
                        if (selectedItem.length <= 0) {
                            selectedItem.push($(this));
                            $(selectedItem[0]).addClass("movement");
                        } else if ($(this).hasClass("row")) {
                            selectedItem.push($(this));
                            $(this).addClass("active");
                        }
                    }
                }
            }
            else if (movmentMode == true) {
                if (selectedItem.length == 0) {
                    selectedItem.push($(this));

                    $(selectedItem[0]).addClass("moving");

                } else if (selectedItem.length == 1) {
                    selectedItem.push($(this));

                    $(selectedItem[1]).addClass("target");

                    canSelect = false;

                    $(deny).insertAfter($('[data-role = "movement"]'));
                    $(accept).insertAfter($('[data-role = "movement"]'));

                }
            }
            else {
                // if none of the selection mode are active just select one element
                selectedItem = [];
                selectedItem.push($(this));
                $('[data-role = "selectable"]').removeClass("active");
                $(selectedItem[0]).addClass("active");

                $("#changeWidth").val($(selectedItem[0]).css("max-width"));
                $("#changeHeight").val($(selectedItem[0]).css("max-height"));
            }

            if (selectedItem.length >= 1) {
                $(".editing").removeAttr("disabled");
            }
        }
        // text selection
        else if (role == "textSelect") {
            selectedText = $(this);
            $("h2").removeClass("active");
            $(this).addClass("active");

            $("#changeSize").val($(this).css("font-size"));
            $("#changeColor").val(rgb2hex($(this).css("color")));
            $("#changeWeight").val($(this).css("font-weight"));
            
            $("#marginTop").val($(this).css("margin-top"));
            $("#marginBottom").val($(this).css("margin-bottom"));
        }
        // text delete
        else if (role == "deleteText") {
            $(selectedText).remove();
        }
        // img selection
        else if (role == "imgSelect") {
            selectedImg = $(this);
            $("img").removeClass("active");
            $(this).addClass("active");
        }
        // img delete
        else if (role == "deleteImg") {
            $(selectedImg).remove();
        }
        // link selection
        else if (role == "linkSelect") {
            selectedImg = $(this);
            $("a").removeClass("active");
            $(this).addClass("active");
        }
        // link delete
        else if (role == "deleteLink") {
            $(selectedImg).remove();
        }
        // link delete
        else if (role == "addLinktext") {
            $(selectedItem[0]).append($(link).append($(text)));
        }
        // delete function
        else if (role == "delete" && selectedItem != "") {
            // is selected element row
            if ($(selectedItem[0]).hasClass("row")) {
                // is there multiple selection of element 
                if (selectedItem.length > 1) {
                    // loop every element in the selected array 
                    $(selectedItem).each(function (i) {
                        $(selectedItem)[i].remove();
                    })
                }
                else {
                    // is there only one element selected
                    $(selectedItem[0]).remove();
                }
                // clear selected element array 
                selectedItem = [];
            } else {
                if (selectedItem.length > 1) {
                    $(selectedItem).each(function (i) {
                        $(selectedItem)[i].remove();
                    })
                }
                else {
                    $(selectedItem[0]).remove();
                }


                if (currentRow.colCount <= selectedItem.length) {
                    $(currentRow.rowItem).addClass("selectable").attr("data-role", "selectable");
                }
                selectedItem = [];
            }
        }
        //add text function
        else if (role == "addText" && selectedItem != "") {
            $(selectedItem[0]).append($(text));
        }
        //add link function
        else if (role == "addLink" && selectedItem != "") {
            $(selectedItem[0]).append($(link));
        }
        //edit position
        else if (role == "editPosition") {
            selectedItem[0].removeClass("y-top y-bottom y-center x-top x-bottom x-center");
            selectedItem[0].addClass($(this).attr("data-value"));
        }
        // actiave movment 
        else if (role == "bgPosition") {
            $(grid).removeClass("bgl bgr bgc")
            $(grid).addClass($(this).attr("data-value"));
        }
        // actiave movment 
        else if (role == "movement") {
            movmentMode = !movmentMode;

            if (movmentMode == true) {
                $(this).html('<i class="fa-solid fa-arrow-right-arrow-left"></i>');

                selectedItem = [];
                $(".selectable").removeClass("active");

            } else {
                $(this).html('<i class="fa-solid fa-up-down-left-right"></i>');
            }
        }
        // deactivate everything
        else if (role == "deny") {
            selectedItem = [];

            $(".selectable").removeClass("active moving target");
            $('[data-role = "accept"]').remove();
            $(this).remove();

            canSelect = true;
            movmentMode = false;

            $('[data-role = "movement"]').html('<i class="fa-solid fa-up-down-left-right"></i>');
        }
        else if (role == "accept") {
            $(selectedItem[0]).clone().insertAfter(selectedItem[1]);
            $(selectedItem[1]).clone().insertAfter(selectedItem[0]);
            $(selectedItem[0]).remove();
            $(selectedItem[1]).remove();

            selectedItem = [];

            $(".selectable").removeClass("active moving target");
            $('[data-role = "deny"]').remove();
            $(this).remove();

            canSelect = true;
            movmentMode = false;

            $('[data-role = "movement"]').html('<i class="fa-solid fa-up-down-left-right"></i>');
        }
        //flags
        else if (role == "flags") {
            if ($(this).attr("data-value") == "mobileInvisible") {
                $(selectedItem).each(function (i) {
                    if (selectedItem[i].hasClass("mobile-invisible")) {
                        $(selectedItem[i]).removeClass("mobile-invisible");
                        $(selectedItem[i]).find(".flags").remove();
                    } else {
                        $(selectedItem[i]).append($(mobileInvisible));
                        $(selectedItem[i]).addClass("mobile-invisible");
                    }
                })
            }

            let icei = 0;

            $(currentRow.rowItem).find(".col").each(function (i) {
                if (currentRow.rowItem.find(".col").eq(i).hasClass("mobile-invisible")) {
                    icei += 1;
                } else {
                    icei -= 1;
                }
            })

            if (icei == $(currentRow.rowItem).find(".col").length) {
                $(currentRow.rowItem).addClass("mobile-invisible");
            } else {
                $(currentRow.rowItem).removeClass("mobile-invisible");
            }


        }
        //img
        else if (role == "cover") {
            $(selectedItem).each(function (i) {
                $(selectedItem[i]).find("img").toggleClass("cover");
            })
        }
        //order text
        else if (role == "orderText") {
            $(selectedText).removeClass("t-left t-center t-right");
            $(selectedText).addClass($(this).attr("data-value"));
        }
        //mobile size text
        else if (role == "mobileSize") {
            $(selectedText).removeClass("mb mm ms");
            $(selectedText).addClass($(this).attr("data-value"));
        }
        //order
        else if (role == "order") {
            console.log(currentRow.rowItem);
            $(currentRow.rowItem).removeClass("leftToright topTobottom bottomTotop");
            $(currentRow.rowItem).addClass($(this).attr("data-value"));
        }
        //export
        else if (role == "export"){
            exportFile = $(".grid").html();

            $("body").append('<div class="standalone-grid">' + exportFile + '</div>').css("width","100vw").css("height", "100vh");
            $(".standalone-grid").find("*").removeClass("selectable active").attr("data-role", "");
        }
        //add text as link
        else if (role == "addLinktext"){

        }
    });

    $(document).on("click", "[data-target]", function () {
        $(".tabs").removeClass("active");
        $("[data-target]").removeClass("active");

        $(this).addClass("active");
        $("#" + $(this).attr("data-target")).addClass("active");
    })

    $(document).on("click" , "input", function(){
        $(this).val("");
    })
});

//keyboard listener
$(document).keydown(function (e) {
    // listening for "shift" key
    if (e.keyCode == 16) {
        areaSelection = true;
    }
    else if (e.keyCode == 17) {
        multipleSelection = true;
    }
});

// disable all states
$(document).keyup(function () {
    areaSelection = false;
    multipleSelection = false;
});

//input listeners
$(document).find("#bg-img").on("change", async function (event) {

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        let imageURL = e.target.result;

        grid.css("background-image", "url(" + imageURL + ")");
    };

    reader.readAsDataURL(file);

    let fd = new FormData();
    let files = $('#bg-img')[0].files;

    if (files.length > 0) {
        fd.append('file');

        $.ajax({
            url: 'js/upload.php',
            type: 'post',
            data: files[0],
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status == 1) {
                    console.log(response);

                } else {
                    console.log(response);
                }
            }
        })
    }
});
$(document).find("#add-img").on("change", function (event) {
    if (selectedItem.length >= 1 && $(selectedItem[0]).has("img").length == 0) {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            let imageURL = e.target.result;

            $(selectedItem[0]).append($(img).attr("src", imageURL));
        };

        reader.readAsDataURL(file);
    }else{
        alert("her kutuya yalnızca 1 adet resim yüklenebilir");
    }
});

$(document).find("#changeSize").on("change", function (event) {
    $(selectedItem[0]).find(".active").css("fontSize", "" + Conversion($(this).val()) + "rem");
});

$(document).find("#changeColor").on("change", function (event) {
    console.log();
    $(selectedItem[0]).find(".active").css("color", "" + $(this).val() + "");
});

$(document).find("#changeWeight").on("change", function (event) {
    console.log();
    $(selectedItem[0]).find(".active").css("fontWeight", "" + $(this).val() + "");
});

$(document).find("#marginTop").on("change", function (event) {

    $(selectedItem[0]).find(".active").css("margin-top", "" + $(this).val() + "px");
});

$(document).find("#marginBottom").on("change", function (event) {

    $(selectedItem[0]).find(".active").css("margin-bottom", "" + $(this).val() + "px");
});

$(document).find("#changeImgSize").on("change", function (event) {
    $(selectedItem[0]).find("img").css("width", "" + Conversion($(this).val()) + "rem");
});

$(document).find("#changeWidth").on("change", function (event) {
    $(selectedItem[0]).css("max-width", "" + $(this).val() + "%");
});

$(document).find("#changeHeight").on("change", function (event) {
    $(selectedItem[0]).css("max-height", "" + $(this).val() + "%");
});

$(document).find("#changePaddingY").on("change", function (event) {
    $(selectedItem[0]).css("padding-top", "" + $(this).val() + "px");
    $(selectedItem[0]).css("padding-bottom", "" + $(this).val() + "px");
});
$(document).find("#changePaddingX").on("change", function (event) {
    $(selectedItem[0]).css("padding-left", "" + $(this).val() + "px");
    $(selectedItem[0]).css("padding-right", "" + $(this).val() + "px");
});
$(document).find("#addLinkimage").on("change", function (event) {
    if (selectedItem.length >= 1) {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            let imageURL = e.target.result;

            $(selectedItem[0]).append($(link));
            $(selectedItem[0]).find("a").append($(img).attr("src", imageURL));
        };

        reader.readAsDataURL(file);
    }
});

function Conversion(pixel)
{
    let rem = 0.0625 * pixel;
    let em = 0.0625 * pixel;
    return rem;
}