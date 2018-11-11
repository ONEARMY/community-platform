/* tslint:disable:one-variable-per-declaration */
/* 
This component forces text to occupy a maximum given number of lines, with optional 'expand'
button. Code modified from react-clamp-lines
*/

import React from 'react'

interface IProps {
  text: string
  buttons?: boolean
  lines: number
  delay?: number
  ellipsis?: string
  moreText?: string
  lessText?: string
  className?: string
}
export class ClampLines extends React.PureComponent<IProps, any> {
  // defaultProps static so can be assigned at end
  public static defaultProps: IProps
  public element: any = null
  public original: string
  public watch = true
  public lineHeight = 0
  public start = 0
  public middle = 0
  public end = 0
  public ssr: any
  public debounced: any

  constructor(props: any) {
    super(props)

    this.state = {
      noClamp: false,
      text: '.',
    }
    this.original = this.props.text

    // If window is undefined it means the code is executed server-side
    this.ssr = typeof window === 'undefined'

    this.action = this.action.bind(this)
    this.clickHandler = this.clickHandler.bind(this)

    if (!this.ssr) {
      this.debounced = this.debounce(this.action, props.delay)
    }
  }

  public componentDidMount() {
    if (this.props.text && !this.ssr) {
      this.lineHeight = this.element.clientHeight + 1
      this.clampLines()

      if (this.watch) {
        window.addEventListener('resize', this.debounced)
      }
    }
  }

  public componentWillUnmount() {
    if (!this.ssr) {
      window.removeEventListener('resize', this.debounced)
    }
  }

  public debounce(func: any, wait: number, immediate?: boolean) {
    let timeout: any

    // was arrow function, need to check 'this' implemented correctly
    return function(this: any) {
      const context = this,
        args = arguments
      const later = () => {
        timeout = null
        if (!immediate) {
          func.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(context, args)
      }
    }.bind(this)
  }

  public action() {
    if (this.watch) {
      this.setState({ noClamp: false })
      this.clampLines()
    }
  }

  public clampLines() {
    this.setState({ text: '' })

    const maxHeight = this.lineHeight * this.props.lines + 1

    this.start = 0
    this.middle = 0
    this.end = this.original.length

    while (this.start <= this.end) {
      this.middle = Math.floor((this.start + this.end) / 2)
      this.element.innerText = this.original.slice(0, this.middle)
      if (this.middle === this.original.length) {
        this.setState({
          text: this.original,
          noClamp: true,
        })
        return
      }

      this.moveMarkers(maxHeight)
    }

    this.element.innerText =
      this.original.slice(0, this.middle - 5) + this.getEllipsis()
    this.setState({
      text: this.original.slice(0, this.middle - 5) + this.getEllipsis(),
    })
  }

  public moveMarkers(maxHeight: number) {
    if (this.element.clientHeight <= maxHeight) {
      this.start = this.middle + 1
    } else {
      this.end = this.middle - 1
    }
  }

  public getClassName() {
    const className = this.props.className ? this.props.className : ''

    return `clamp-lines ${className}`
  }

  public getEllipsis() {
    return this.watch && !this.state.noClamp ? this.props.ellipsis : ''
  }

  public getButton() {
    if (this.state.noClamp || !this.props.buttons) {
      return
    }
    const buttonText = this.watch ? this.props.moreText : this.props.lessText
    return (
      <button className="clamp-lines__button" onClick={this.clickHandler}>
        {buttonText}
      </button>
    )
  }

  public clickHandler(e: any) {
    e.preventDefault()

    this.watch = !this.watch
    this.watch ? this.clampLines() : this.setState({ text: this.original })
  }

  public render() {
    if (!this.props.text) {
      return null
    }

    return (
      <div className={this.getClassName()}>
        <div
          ref={e => {
            this.element = e
          }}
        >
          {this.state.text}
        </div>
        {this.getButton()}
      </div>
    )
  }
}

ClampLines.defaultProps = {
  text: '',
  buttons: false,
  lines: 3,
  delay: 300,
  ellipsis: '...',
  moreText: 'Read more',
  lessText: 'Read less',
}
