<script>
$(document).ready(function() {
    // 1. Имитация базы данных курсов (т.к. сервера нет)
    const mockRates = {
        'BTC': 65000,
        'ETH': 3500,
        'LTC': 80,
        'XMR': 160,
        'USDT': 1,
        'SOL': 140,
        'TRX': 0.12,
        'DOGE': 0.15
    };

    function updateCalculations() {
        const fromVal = $('.ps-list[data-dir="from"] .home-change__list-item.active').data('valute');
        const toVal = $('.ps-list[data-dir="to"] .home-change__list-item.active').data('valute');

        if (mockRates[fromVal] && mockRates[toVal]) {
            const rate = (mockRates[fromVal] / mockRates[toVal]).toFixed(6);
            const reverseRate = (mockRates[toVal] / mockRates[fromVal]).toFixed(6);

            // Обновляем текст курса в центре
            $('#xc-com').text(`1 ${fromVal} = ${rate} ${toVal}`);

            // Если введено число в поле "Отдаете", пересчитываем "Получаете"
            const inputVal = parseFloat($('#from_summ').val());
            if (!isNaN(inputVal)) {
                $('#to_summ').val((inputVal * rate).toFixed(6));
            }
        }
    }

    // 2. Перехватываем клик по валюте
    $('body').on('click', '.home-change__list-item', function(e) {
        // Останавливаем стандартные попытки отправить запрос на сервер
        e.preventDefault(); e.stopPropagation();

        const $this = $(this);
        const direction = $this.closest('[data-dir]').data('dir'); // from или to
        const name = $this.data('name');
        const valute = $this.data('valute');
        const img = $this.find('img').attr('src');
        const minVal = $this.find('.mr').data('d0') || "min: 0";
        const reserve = $this.find('.mr').data('d1') || "0";

        // Визуальное переключение активного элемента
        $this.closest('.home-change__list').find('.home-change__list-item').removeClass('active');
        $this.addClass('active');

        // Обновляем центральный блок калькулятора
        if (direction === 'from') {
            $('[data-psname="from"]').text(name);
            $('[data-image="from"]').attr('src', img);
            $('#from_val_valute').text(valute);
            $('#from_summ').attr('placeholder', minVal);
            $('#s1sub span').text(minVal.replace('min: ', '') + ' ' + valute);
        } else {
            $('[data-psname="to"]').text(name);
            $('[data-image="to"]').attr('src', img);
            $('#to_val_valute').text(valute);
            $('#to_summ').attr('placeholder', reserve);
        }

        // Пересчитываем курс
        updateCalculations();

        // Маленький фикс: если это мобилка, закрываем модалку выбора (если она была)
        $('#currency').modal('hide');
    });

    // 3. Обработка ввода суммы
    $('#from_summ').on('input', function() {
        updateCalculations();
    });

    // 4. Убираем блокировку кнопки (таймер)
    // В твоем коде кнопка заблокирована на 90 сек, принудительно включаем её через 2 сек
    setTimeout(function() {
        $('#start_ex').prop('disabled', false).removeClass('wait').text('Start exchange');
    }, 2000);

    // Инициализация при загрузке
    updateCalculations();
});
</script>