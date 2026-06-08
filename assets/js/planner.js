(function() {
  document.querySelectorAll('h2.goals-title + ul, h3.day-title + ul, ul.task-list').forEach(function(ul) {
    ul.classList.add('task-list');
    ul.querySelectorAll('li').forEach(function(li) {
      var text = li.textContent.trim();
      var checked = false;

      var cb = li.querySelector('.task-list-item-checkbox, input[type=checkbox]');
      if (cb) {
        cb.removeAttribute('disabled');
        cb.type = 'checkbox';
        cb.className = 'task-checkbox';
        var span = document.createElement('span');
        span.textContent = li.textContent;
        li.innerHTML = '';
        cb.checked = cb.hasAttribute('checked');
        li.appendChild(cb);
        li.appendChild(span);
        return;
      }

      if (/^\[x\]/i.test(text)) { checked = true; text = text.replace(/^\[x\]\s*/i, ''); }
      else if (/^\[ \]/.test(text)) { text = text.replace(/^\[ \]\s*/, ''); }
      else return;

      li.innerHTML = '';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'task-checkbox';
      if (checked) input.checked = true;
      var span = document.createElement('span');
      span.textContent = text;
      li.appendChild(input);
      li.appendChild(span);
    });
  });
})();
