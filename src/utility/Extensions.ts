interface HTMLElement {
    isEqualOrDescendant(parent:HTMLElement|null): boolean;
    isEqualOrDescendantById(parentId:string) : boolean;
}

HTMLElement.prototype.isEqualOrDescendant = function(parent) {
    if(this == parent) return true;
    var node = this.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

HTMLElement.prototype.isEqualOrDescendantById = function(parentId:string){
    return this.isEqualOrDescendant(document.getElementById(parentId));
}
