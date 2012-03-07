/** section: Language
 * class Date
 *
 *  Extensions to the built-in `Date` object.
**/


(function(proto) {
  
  /**
   *  Date#toISOString() -> String
   *
   *  Produces a string representation of the date in ISO 8601 format.
   *  The time zone is always UTC, as denoted by the suffix "Z".
   *
   *  <h5>Example</h5>
   *
   *      var d = new Date(1969, 11, 31, 19);
   *      d.getTimezoneOffset();
   *      //-> -180 (time offest is given in minutes.)
   *      d.toISOString();
   *      //-> '1969-12-31T16:00:00Z'
  **/
  
  function toISOString() {
    return this.getUTCFullYear() + '-' +
      (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
      this.getUTCDate().toPaddedString(2) + 'T' +
      this.getUTCHours().toPaddedString(2) + ':' +
      this.getUTCMinutes().toPaddedString(2) + ':' +
      this.getUTCSeconds().toPaddedString(2) + 'Z';
  }
  
  /**
   *  Date#toJSON() -> String
   *
   *  Internally calls [[Date#toISOString]].
   *
   *  <h5>Example</h5>
   *
   *      var d = new Date(1969, 11, 31, 19);
   *      d.getTimezoneOffset();
   *      //-> -180 (time offest is given in minutes.)
   *      d.toJSON();
   *      //-> '1969-12-31T16:00:00Z'
  **/

  function toJSON() {
    return this.toISOString();
  }
  
	/**
	 * Date#setShortYear(year) -> Number
	 * set year in short format
	 * if year < 79 year is after 2000 if not before
	 * 
	 *		##### Example :
	 *		
	 *			var date = new Date(1259967600448);
	 *			date.setShortYear(81)
	 *			//->Date {Sat Dec 05 1981 00:00:00 GMT+0100}
	 *			
	 *			var date = new Date(1259967600448);
	 *			date.setShortYear(55)
	 *			//->Date {Sun Dec 05 2055 00:00:00 GMT+0100}
	 *			
	 */
	function setShortYear(year){
		var Year = (year < 79 ? '20' : '19') + year.toString();
		return this.setFullYear(Year);
	}
	/**
	 * Date#setRealMonth(month) -> Number
	 * set the month in real format (1-12)
	 */
	function setRealMonth(month){
		return this.setMonth(month-1);
	}
	/**
	 * Date#getShortYear() -> Number
	 * returns the year in short format (yy)
	 */
	function getShortYear(){
		return this.getFullYear().toString().substr(2);
	}
	/**
	 * Date#getRealMonth() -> Number
	 * returns number of month (1-12)
	 */
	function getRealMonth(month){
		return parseInt(this.getMonth())+1;
	}
	/**
	 * Date#clone() -> Date
	 * returns a clone of the date
	 * 
	 *		##### Example
	 *			var dates = [new Date(1259967600448)];
	 *			dates[1] = dates[0].clone();
	 *			dates[1].setFullYear(2002);
	 *			//-> [Date {Sat Dec 05 2009 00:00:00 GMT+0100}, Date {Thu Dec 05 2002 00:00:00 GMT+0100}]
	 */
	function clone(){
		return new Date(this.getTime());
	}
	/**
	 * Date#getNbDaysOfMonth() -> Number
	 * returns the number of days in month
	 * 
	 *		##### Example : 
	 *			var date = new Date(1259967600448);
	 *			date.getWeek() ;
	 *			//-> 48
	 */
	function getNbDaysOfMonth (){
		var nb = [31,28,31,30,31,30,31,31,30,31,30,31];
		return (this.getMonth() == 1 && this.getFullYear()%4 == 0) ? (nb[this.getMonth()]+1) : nb[this.getMonth()] ;
	}
	/**
	 * Date#add(number, unit) -> Date
	 * add number unit to date
	 * 
	 *		##### Example : 
	 *			var date = new Date(1259967600448);
	 *			date.add(1) ;
	 *			//-> Date {Sun Dec 06 2009 00:00:00 GMT+0100}
	 *			date.add(3, 'year') ;
	 *			//-> Date {Wed Dec 05 2012 00:00:00 GMT+0100}
	 *			date.add(2, 'month');
	 *			//-> Date {Tue Feb 05 2013 00:00:00 GMT+0100}
	 *			date.add(-8, 'hour');
	 *			//-> Date {Mon Feb 04 2013 16:00:00 GMT+0100}
	 */
	function add(number,unit){
		var multipliers = {
			year	: (this.getFullYear()%4 == 0 ? 366 : 365) * 24*60*60*1000,
			month	: this.getNbDaysOfMonth() * 24*60*60*1000,
			week	: 7 * 24*60*60*1000,
			day		: 24*60*60*1000,
			hour	: 60*60*1000,
			minute	: 60*1000,
			second	: 1000
		}
		return this.setTime(this.getTime()+((multipliers[unit]||multipliers.day)*number));
	}
	/**
	 * Date#getWeek() -> Number
	 * returns the number of the week
	 */
	function getWeek () {
		var newYear = new Date(this.getFullYear(),0,1);
		var day = newYear.getDay();
		day = (day >= 0 ? day : day + 7);
		var daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
		var weeknum;
		if(day < 4) {
			weeknum = Math.floor((daynum+day-1)/7) + 1;
			if(weeknum > 52) {
				var nYear = new Date(this.getFullYear() + 1,0,1);
				var nday = nYear.getDay();
				nday = nday >= 0 ? nday : nday + 7;
				weeknum = nday < 4 ? 1 : 53;
			}
		}
		else {
			weeknum = Math.floor((daynum+day-1)/7);
		}
		return weeknum;
	}
	
	/**
	 * Date#setInt(int, format) -> Date
	 * parse int with format and set Date
	 * default format is YmdHMS
	 * 
	 *		#### Example :
	 *		
	 *			var date = new Date(1259967600448) ; // 2009-12-05 00:00:00
	 *			date.setInt(20120131) ;
	 *			//-> Date {Tue Jan 31 2012 00:00:00 GMT+0100}
	 *			
	 *			var date = new Date(1259967600448) ; // 2009-12-05 00:00:00
	 *			date.setInt(909, 'ymd');
	 *			//-> Date {Mon Aug 31 2009 00:00:00 GMT+0200}
	 *			
	 *			var date = new Date(1259967600448) ; // 2009-12-05 00:00:00
	 *			date.setInt(20120131183055) ;
	 *			//-> Date {Tue Jan 31 2012 18:30:55 GMT+0100}
	 *			
	 */
	function setInt(value, format){
		if(!format)
			format = 'YmdHMS';
		else 
			format = format.gsub(/([^\w])/);
		var value = value.toString();
		if(value.length%2 != 0)
			value = '0'+value;
		if(!format.include('%'))
			format = '%'+format.split('').join('%');
		var dateFormat = new DateFormat(format) ;
		return dateFormat.setFromFormat(this, value);
	}

	/**
	 * Date#setYmdInt(int) -> Date
	 * set FullYear, Month and Day from int
	 *		#### Example :
	 *			var date = new Date(1259967600448) ; // 2009-12-05 00:00:00
	 *			date.setYmdInt(20120131) ;
	 *			//-> Date {Tue Jan 31 2012 00:00:00 GMT+0100}
	 */
	function setYmdInt (value){
		return this.setInt(value, 'Ymd');
	}
	/**
	 * Date#setymdInt(int) -> Date
	 * set ShortYear, Month and Day from int
	 */
	function setymdInt (value){
		return this.setInt(value, 'ymd');
	}
	/**
	 * Date#setdmYInt(int) -> Date
	 * set Day, Month and FullYear from int
	 */
	function setdmYInt(value){
		return this.setInt(value, 'dmY');
	}
	/**
	 * Date#setdmyInt(int) -> Date
	 * set Day, Month, ShortYear from int
	 */
	function setdmyInt(value){
		return this.setInt(value, 'dmy');
	}
	/**
	 * Date#setYmdHMSInt(int) -> Date
	 * set FullYear, Month, Day, Hours, Minutes and Seconds from int
	 */
	function setYmdHMSInt(value){
		return this.setInt(value);
	}
	/**
	 * Date#setdmYHMSInt(int) -> Date
	 * set Day, Month, FullYear, Hours, Minutes and Seconds  from int
	 */
	function setdmYHMSInt(value){
		return this.setInt(value, 'dmYHMS');
	}
	/**
	 * Date#setHMSInt(int) -> Date
	 * set Hours, Minutes and Seconds from int
	 */
	function setHMSInt (value){
		return this.setInt(value, 'HMS');
	}
	/**
	 * Date#setHMInt(int) -> Date
	 * set Hours and Minutes from int
	 */
	function setHMInt (value){
		return this.setInt(value, 'HM');
	}
	
	/**
	 * Date#setHMInt(dayNumber) -> Date
	 * returns the date of the previous day number dayNumber
	 *
	 *		##### Example :
	 *			var date = new Date(1259967600448) ;
	 *			new Date(date.getPrecedentDay(3)) ;
	 *			//-> Date {Wed Dec 02 2009 00:00:00 GMT+0100}
	 *			
	 *			var date = new Date(1259967600448) ;
	 *			new Date(date.getPrecedentDay(0)) ;
	 *			//-> Date {Sun Nov 29 2009 00:00:00 GMT+0100}
	 *			
	 */
	function getPrecedentDay(dayNumber){
		var day = this.getDay();
		if(day == 0)
			day = 7;
		var dayDif = dayNumber - day ;

		return this.add(dayDif);
	}
  
  if (!proto.toISOString)		proto.toISOString		= toISOString;
  if (!proto.toJSON)			proto.toJSON			= toJSON;
  
  if (!proto.setShortYear)		proto.setShortYear		= setShortYear;
  if (!proto.setRealMonth)		proto.setRealMonth		= setRealMonth;
  if (!proto.getShortYear)		proto.getShortYear		= getShortYear;
  if (!proto.getRealMonth)		proto.getRealMonth		= getRealMonth;
  if (!proto.getNbDaysOfMonth)	proto.getNbDaysOfMonth	= getNbDaysOfMonth;
  if (!proto.add)				proto.add				= add;
  if (!proto.getWeek)			proto.getWeek			= getWeek;
  if (!proto.setymdInt)			proto.setymdInt			= setymdInt;
  if (!proto.setYmdInt)			proto.setYmdInt			= setYmdInt;
  if (!proto.setHMSInt)			proto.setHMSInt			= setHMSInt;
  if (!proto.setdmyInt)			proto.setdmyInt			= setdmyInt;
  if (!proto.setdmYInt)			proto.setdmYInt			= setdmYInt;
  if (!proto.setdmYHMInt)		proto.setdmYHMInt		= setdmYHMSInt;
  if (!proto.setdmYHMSInt)		proto.setdmYHMSInt		= setdmYHMSInt;
  if (!proto.setYmdHMInt)		proto.setYmdHMInt		= setYmdHMSInt;
  if (!proto.setYmdHMSInt)		proto.setYmdHMSInt		= setYmdHMSInt;
  if (!proto.getPrecedentDay)	proto.getPrecedentDay	= getPrecedentDay;
  if (!proto.setInt)			proto.setInt			= setInt;
  if (!proto.clone)				proto.clone				= clone;
  
})(Date.prototype);

/**
 * DateFormat Class to manipulate DateFormat
 *
 */





var DateFormat = Class.create({
	shortcuts : {
		'Y' : {method : 'FullYear',	digits : 4},
		'm' : {method : 'RealMonth',digits : 2},
		'd' : {method : 'Date',		digits : 2},
		'y' : {method : 'ShortYear',digits : 2},
		'H' : {method : 'Hours',	digits : 2},
		'M' : {method : 'Minutes',	digits : 2},
		'S' : {method : 'Seconds',	digits : 2}
	},
	initialize : function(format){
		this.currentFormat = format;
	},
	/**
	 * DateFormat#setFromFormat(date, string) -> Date
	 * merge a date with the elements found in the string by currentFormat
	 * 
	 *		##### Example :
	 * 
	 *			var df = new DateFormat('%Y-%m-%d à %H h %M min');
	 *			var d = new Date();
	 *			df.setFromFormat(d, '1999-05-12 à 18 h 05 min'); 
	 *			console.log(d) ;
	 *			//-> Date {Wed May 12 1999 18:05:47 GMT+0200}
	 *
	 *
	 */
	setFromFormat : function(date, string){
		if(string.length != this.standLength())
			string.padString(this.standLength(), "0") ;
		return this.setDateFromFormat(date, string);
	},
	setDateFromFormat : function(date, string){
		var pattern = /([^\%]*)%(\w+)/, source = this.currentFormat, match, code, deb, currentPos = 0 ;
		while (source.length > 0) {
			if (match = source.match(pattern)) {
				code = match[2];
				if(this.shortcuts[code] && this.shortcuts[code].method){
					deb = currentPos + match[1].length ;
					currentPos = deb + (this.shortcuts[code].digits || 0);
					date['set'+this.shortcuts[code].method](string.substring(deb, currentPos)) ;
				}
				source  = source.slice(match.index + match[0].length);
			} else {
				source = '';
			}
		}
		return date ;
	},
	standLength : function (){
		var length = 0 ;
		this.currentFormat.gsub('%').split('').each(function(code){
			length += this.shortcuts[code] && this.shortcuts[code].digits ? this.shortcuts[code].digits : 0;
		}.bind(this));
		return length ;
	}
});