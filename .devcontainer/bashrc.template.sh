# If not running interactively, don't do anything
[ -z "$PS1" ] && return

# persistent bash history
HISTFILE=~/.bash_history
PROMPT_COMMAND="history -a; $PROMPT_COMMAND"

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# Prompt with colored text
if [[ ${EUID} == 0 ]] ; then
    PS1='\[\033[38;2;221;75;57m\]\$ \[\033[38;2;0;135;175m\]\h \[\033[38;2;83;85;85m\]\w \[\033[0m\]'
else
    PS1='\[\033[38;2;105;121;16m\]\$ \[\033[38;2;0;135;175m\]\u@\h \[\033[38;2;83;85;85m\]\w \[\033[0m\]'
fi
