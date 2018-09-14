'use strict';

function Picker()
{
  this.memory = "";
  this.el = document.createElement("div");
  this.el.id = "picker"
  this.input = document.createElement("input");
  this.input.id = "picker_input"
  this.original = null;

  this.el.appendChild(this.input)

  this.start = function()
  {
    this.input.setAttribute("placeholder",`${dotgrid.tool.style().color.replace("#","").trim()}`)
    this.input.setAttribute("maxlength",6)

    try{ dotgrid.controller.set("picker"); }
    catch(err){ }

    dotgrid.interface.el.className = "picker"
    this.input.focus()
    this.original = dotgrid.tool.style().color
    this.input.value = ""
  }

  this.stop = function()
  {
    this.cancel();

    try{ dotgrid.controller.set(); }
    catch(err){ console.log("No controller"); }

    dotgrid.interface.el.className = ""
    this.input.blur()
    this.input.value = ""

    setTimeout(() => { dotgrid.interface.update(true); }, 250)
  }

  this.validate = function()
  {
    if(!is_color(this.input.value)){ return; }

    let hex = `#${this.input.value}`;

    this.set_color(hex);

    dotgrid.guide.update();
    
    try{ dotgrid.controller.set(); }
    catch(err){ console.log("No controller"); }

    dotgrid.interface.el.className = ""
    this.input.blur()
    this.input.value = ""

    setTimeout(() => { dotgrid.interface.update(true); }, 250)
  }

  this.set_color = function(color)
  {
    dotgrid.tool.style().color = color;
    dotgrid.tool.style().fill = dotgrid.tool.style().fill != "none" ? color : "none";
  }

  this.set_size = function(size)
  {
    dotgrid.set_size(size);
  }

  this.cancel = function()
  {
    if(!this.original){ return; }
    dotgrid.guide.update();
    setTimeout(() => { dotgrid.interface.update(true); }, 250)
  }

  this.update = function()
  {
    if(!is_color(this.input.value)){ return; }

    let hex = `#${this.input.value}`;

    document.getElementById("option_color").children[0].style.fill = hex;
    document.getElementById("option_color").children[0].style.stroke = hex;
  }

  this.listen = function(e,is_down = false)
  {
    if(is_down && !is_color_char(e.key)){
      e.preventDefault();
      return;
    }

    if(e.key == "Enter"){
      this.validate();
      e.preventDefault();
      return;
    }

    if(e.key == "Escape"){
      this.stop();
      e.preventDefault();
      return;
    }

    this.update();
  }

  function is_color(val)
  {
    if(val.length != 3 && val.length != 6){
      return false
    }

    let re = /[0-9A-Fa-f]/g;
    return re.test(val)
  }

  function is_color_char(val)
  {
    let re = /[0-9A-Fa-f]/g;
    return re.test(val)
  }

  this.input.onkeydown = function(event){ dotgrid.picker.listen(event,true); }
  this.input.onkeyup = function(event){ dotgrid.picker.listen(event); };
}