import com.aimit.htwg.catan.util.RichAny

/**
 * @author Vincent76
 */
package object util {

  implicit class ConsoleString( val s:String ) {
    val consoleTextColors = Map(
      Console.BLACK -> "black",
      Console.RED -> "red",
      Console.GREEN -> "green",
      Console.YELLOW -> "darkkhaki",
      Console.BLUE -> "blue",
      Console.MAGENTA -> "magenta",
      Console.CYAN -> "cyan",
      Console.WHITE -> "white"
    )
    val consoleBackgroundColors = Map(
      Console.BLACK_B -> "black",
      Console.RED_B -> "red",
      Console.GREEN_B -> "green",
      Console.YELLOW_B -> "yellow",
      Console.BLUE_B -> "blue",
      Console.MAGENTA_B -> "magenta",
      Console.CYAN_B -> "cyan",
      Console.WHITE_B -> "white"
    )
    val consoleReset:String = Console.RESET
    val consoleOther = List(
      Console.RESET,
      Console.BOLD,
      Console.UNDERLINED,
      Console.BLINK,
      Console.REVERSED,
      Console.INVISIBLE
    )

    def filterColors:String = {
      val textFiltered = s._filterColors( consoleTextColors, "color" )
      val bgFiltered = textFiltered._filterColors( consoleBackgroundColors, "background-color" )
      val otherFiltered = bgFiltered.use( s => consoleOther.foldLeft( s )( ( s, c ) => {
        val res = s.replace( c, "" )
        res
      } ) )
      otherFiltered//.replace( "\n", "<br />" )
    }

    def _filterColors( colors:Map[String,String], attribute:String ):String = {
      val indices = colors.map( c => (c._1, c._2, s.indexOf( c._1 ) ) ).filter( c => c._3 >= 0 ).toSeq.sortBy( _._3 )
      if( indices.nonEmpty ) {
        val first = indices.head
        val nextTextColor = indices.lift( 1 )
        val nextReset = s.indexOf( consoleReset, first._3 + 1 )
        val end = if( nextTextColor.isDefined && ( nextReset < 0 || nextTextColor.get._3 < nextReset ) ) {
          nextTextColor.get._3
        } else if( nextReset > 0 ) {
          nextReset
        } else {
          s.length
        }
        val s1 = s.patch( end, "</span>", 0 )
        val s2 = s1.patch( first._3, s"<span style=\"$attribute:${first._2};white-space:pre\">", first._1.length )
        s2._filterColors( colors, attribute )
      } else s
    }
  }
}
