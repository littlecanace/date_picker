function DatePicker(options) {
    this.startYear = options.startYear || 1990;
    this.endYear = options.endYear || (new Date()).getFullYear();
    this.initDate = options.initDate ? new Date(options.initDate) : new Date();
    this.nameEl = document.getElementById('picker');
    this.years = [];
    this.months = [];
    this.days = [];
    this.selectedIndex = [];
    this.checked = [];
    this.picker = undefined;
    this.init();
}
DatePicker.prototype = {
    creatList: function(obj, list, now) {
        var _this = this;
        obj.forEach(function(item, index, arr) {
            var temp = new Object();
            temp.text = item;
            temp.value = index;
            list.push(temp);
            if (now == item) {
                _this.selectedIndex.push(index);
                _this.checked.push(index);
            }
        });
    },
    /**
     * [判断是否闰年]
     * @param  {[type]}  year [年]
     */
    isLeapYear: function(year) {
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    },
    /**
     * [获取日数组或者当前月天数]
     * @param  {[type]} year  [年]
     * @param  {[type]} month [月]
     * @param  {[type]} type  [type有传返回当前月天数，不传返回日数组]
     */
    getDays: function(year, month, type) {
        var daysNum = 31,
            days = [];
        if (4 == month || 6 == month || 9 == month || 11 == month) {
            daysNum = 30;
        } else if (2 == month) {
            if (this.isLeapYear(year)) {
                daysNum = 29;
            } else {
                daysNum = 28;
            }
        }
        for (var i = 1; i <= daysNum; i++) {
            days.push(i + '日');
        }
        return type ? daysNum : days;
    },
    setInitDate: function() {
        var years = [],
            months = [],
            days = [];
        for (var i = this.startYear; i <= this.endYear; i++) {
            years.push(i + '年');
        }
        for (var i = 1; i <= 12; i++) {
            months.push(i + '月');
        }
        this.creatList(years, this.years, this.initDate.getFullYear() + '年');
        this.creatList(months, this.months, this.initDate.getMonth() + 1 + '月');
        this.creatList(this.getDays(this.initDate.getFullYear(), this.initDate.getMonth() + 1), this.days, this.initDate.getDate() + '日');
        this.newPicker();
    },
    newPicker: function() {
        this.picker = new Picker({
            data: [this.years, this.months, this.days],
            selectedIndex: this.selectedIndex,
            title: '日期选择'
        });
    },
    yearChange: function(selectedIndex) {
        this.checked[0] = selectedIndex;
        if (1 == this.checked[1]) {
            this.monthChange(this.checked[1]);
        }
    },
    monthChange: function(selectedIndex) {
        this.days = [];
        this.checked[1] = selectedIndex;

        var currentYear = this.years[this.checked[0]].text.replace('年', ''),
            currentMonth = this.months[this.checked[1]].text.replace('月', '');
        this.creatList(this.getDays(currentYear, currentMonth), this.days);
        this.picker.refillColumn(2, this.days);
        if (this.checked[2] >= this.getDays(currentYear, currentMonth, 1)) {
            this.picker.scrollColumn(2, 15);
        }
    },
    dayChange: function(selectedIndex) {
        this.checked[2] = selectedIndex;
    },
    bindEvent: function() {
        var _this = this;
        /**
         * [填充所选日期]
         * @param  {[type]} selectedVal    [选中值索引]
         * @param  {[type]} selectedIndex) [选中值索引]
         */
        _this.picker.on('picker.select', function(selectedVal, selectedIndex) {
            var text1 = _this.years[_this.selectedIndex[0]].text;
            var text2 = _this.months[_this.selectedIndex[1]].text;
            var text3 = _this.days[_this.selectedIndex[2]] ? _this.days[_this.selectedIndex[2]].text : '';

            _this.nameEl.innerText = text1 + ' ' + text2 + ' ' + text3;
        });
        _this.picker.on('picker.valuechange', function(selectedVal, selectedIndex) {
            console.log(selectedIndex);
        });

        _this.nameEl.addEventListener('click', function() {
            _this.picker.show();
        });
        document.querySelector('.picker-mask').addEventListener('click', function() {
            _this.picker.hide();
        });
        _this.picker.on('picker.change', function(index, selectedIndex) {
            if (index === 0) {
                _this.yearChange(selectedIndex);
            } else if (index === 1) {
                _this.monthChange(selectedIndex);
            } else {
                _this.dayChange(selectedIndex);
            }
        });
    },
    init: function() {
        this.setInitDate();
        this.bindEvent();
    }
};
