(function() {
  function processList(ul) {
    ul.classList.add('task-list');
    Array.from(ul.children).forEach(function(li) {
      if (li.tagName !== 'LI') return;
      var nestedUl = li.querySelector(':scope > ul');
      if (nestedUl) li.removeChild(nestedUl);
      var text = li.textContent.trim();
      var checked = false;
      var cb = li.querySelector(':scope > .task-list-item-checkbox, :scope > input[type=checkbox]');
      if (cb) {
        cb.removeAttribute('disabled');
        cb.type = 'checkbox';
        cb.className = 'task-checkbox';
        var span = document.createElement('span');
        span.textContent = text;
        li.innerHTML = '';
        cb.checked = cb.hasAttribute('checked');
        li.appendChild(cb);
        li.appendChild(span);
        if (nestedUl) { li.appendChild(nestedUl); processList(nestedUl); }
        return;
      }
      if (/^\[x\]/i.test(text)) { checked = true; text = text.replace(/^\[x\]\s*/i, ''); }
      else if (/^\[ \]/.test(text)) { text = text.replace(/^\[ \]\s*/, ''); }
      else {
        if (nestedUl) { li.appendChild(nestedUl); processList(nestedUl); }
        return;
      }
      li.innerHTML = '';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'task-checkbox';
      if (checked) input.checked = true;
      var span = document.createElement('span');
      span.textContent = text;
      li.appendChild(input);
      li.appendChild(span);
      if (nestedUl) { li.appendChild(nestedUl); processList(nestedUl); }
    });
  }
  document.querySelectorAll('h2.goals-title + ul, h3.day-title + ul, ul.task-list').forEach(function(ul) {
    processList(ul);
  });
})();
