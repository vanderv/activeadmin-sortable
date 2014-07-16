//= require jquery-ui/sortable
//= require jquery-ui/droppable
//= require jquery-ui/effect-highlight

(function($) {
  $(document).ready(function() {
    $('.handle').closest('tbody').activeAdminSortable();
  });

  $.fn.activeAdminSortable = function() {

    this.sortable({
      handle: '.activeadmin-sortable',
      start: function(event, ui) {
        not_sortable = ui.item.parent().find("tr").not(ui.helper, ui.placeholder);
        $('td', not_sortable).each(function(n){
          $("td", ui.helper).eq(n).css('width', $(this).width());
        });
      },
      stop: function(event, ui) {
        $('td', ui.item).each(function(n){
          $(this).css('width', "auto");
        });
      },      
      update: function(event, ui) {
        var url = ui.item.find('[data-sort-url]').data('sort-url');
        var new_position = ui.item.index() + 1;
        $.ajax({
          url: url,
          type: 'post',
          data: { position: new_position },
          success: function() {
            ui.item.children('td').effect('highlight', {}, 1000)
          }
        });

      }
    });

    $(".pagination .page:not(.current)").droppable({
      handle: '.activeadmin-sortable',
      activeClass: "drop_active",
      hoverClass: "drop_hover",
      tolerance: "pointer",
      drop: function(event, ui){
        var url = ui.draggable.find('[data-sort-url]').data('sort-url');
        var quantity_items = ui.draggable.parent().find("tr").size() - 1;
        var new_position = quantity_items * parseInt($(event.target).text()) - 1; 
        $.ajax({
          url: url,
          type: 'post',
          data: { position: new_position },
          success: function() { 
            url = $(event.target).find("a").attr("href");
            window.location.href = url;
          }
        });

      }   
    });


    this.disableSelection();
  }
  
})(jQuery);
