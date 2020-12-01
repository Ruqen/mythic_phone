function SetupData(data) {  
    $.each(data, function(index, item) {
        window.localStorage.setItem(item.name, JSON.stringify(item.data));
    });
}

function StoreData(name, data) { 
    window.localStorage.setItem(name, JSON.stringify(data));
}

function GetData(name) {
    return JSON.parse(window.localStorage.getItem(name));
}

function ClearData() {
    window.localStorage.clear(); 
}

export default { SetupData, StoreData, GetData, ClearData }