export default function debounce(func: Function, wait: number = 1000) {
    let lastArgs: any[] | undefined;
    let lastThis: any;
    let maxWait: number;
    let result: any;
    let timerId: number | undefined;
    let lastCallTime: number | undefined;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;

    wait = +wait || 0;

    function invokeFunc(time: number) {
        const args = lastArgs;
        const thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }

    function startTimer(pendingFunc: Function, wait: number) {
        return setTimeout(pendingFunc, wait);
    }

    function cancelTimer(id: number) {
        clearTimeout(id);
    }

    function leadingEdge(time: number) {
        lastInvokeTime = time;
        timerId = startTimer(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time: number) {
        const timeSinceLastCall = (lastCallTime) ? (time - lastCallTime) : 0;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;

        return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }

    function shouldInvoke(time: number) {
        const timeSinceLastCall = (lastCallTime) ? (time - lastCallTime) : 0;
        const timeSinceLastInvoke = time - lastInvokeTime;

        return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timerId = startTimer(timerExpired, remainingWait(time));
    }

    function trailingEdge(time: number) {
        timerId = undefined;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }

    function cancel() {
        if (timerId !== undefined) {
            cancelTimer(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }

    function pending() {
        return timerId !== undefined;
    }

    function debounced(...args: any[]) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        // @ts-ignore
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                timerId = startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = startTimer(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
}