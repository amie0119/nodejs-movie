$(function() {
  $('.del').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');//通过data-id拿到id值
    var tr = $('.item-id-' + id);

    $.ajax({
      type: 'DELETE',
      url: '/admin/list?id=' + id
    })
    .done(function(result) {
      if (result.success === 1) {
        if (tr.length > 0) {
          tr.remove();
        }
      }
    })
  })
})